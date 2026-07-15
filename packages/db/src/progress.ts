import { and, desc, eq, gte } from "drizzle-orm";
import type { Database } from "./client";
import { profiles, readingSessions, userVocabulary } from "./schema";

export type ProgressSummary = {
  knownWords: number;
  newWords: number;
  savedWords: number;
  readingTime: string;
  readingTimeSeconds: number;
  streakDays: number;
  textsStarted: number;
  textsCompleted: number;
  level: {
    current: "N5" | "N4" | "N3";
    next: "N5" | "N4" | "N3";
    goal: "N5" | "N4" | "N3";
    percent: number;
  };
  weeklyReading: Array<{ day: string; percent: number }>;
  vocabulary: {
    known: number;
    knownPercent: number;
    new: number;
    newPercent: number;
    review: number;
    reviewPercent: number;
  };
};

function formatReadingTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours <= 0) return `${minutes}m`;
  return `${hours}h ${minutes}m`;
}

function dayLabel(date: Date) {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]!;
}

function nextLevel(level: "N5" | "N4" | "N3"): "N5" | "N4" | "N3" {
  if (level === "N5") return "N4";
  if (level === "N4") return "N3";
  return "N3";
}

function goalLevel(level: "N5" | "N4" | "N3"): "N5" | "N4" | "N3" {
  if (level === "N5") return "N3";
  return "N3";
}

export async function recordReadingHeartbeat(
  db: Database,
  input: {
    userId: string;
    textId: string;
    secondsDelta?: number;
    completed?: boolean;
    lastParagraphIndex?: number;
  },
) {
  const secondsDelta = Math.max(0, Math.min(input.secondsDelta ?? 30, 120));
  const existing = await db.query.readingSessions.findFirst({
    where: and(
      eq(readingSessions.userId, input.userId),
      eq(readingSessions.textId, input.textId),
      eq(readingSessions.completed, false),
    ),
    orderBy: [desc(readingSessions.updatedAt)],
  });

  let session;
  if (existing) {
    const [updated] = await db
      .update(readingSessions)
      .set({
        secondsRead: existing.secondsRead + secondsDelta,
        completed: input.completed ?? existing.completed,
        lastParagraphIndex:
          input.lastParagraphIndex ?? existing.lastParagraphIndex,
        updatedAt: new Date(),
      })
      .where(eq(readingSessions.id, existing.id))
      .returning();
    session = updated;
  } else {
    const [created] = await db
      .insert(readingSessions)
      .values({
        userId: input.userId,
        textId: input.textId,
        secondsRead: secondsDelta,
        completed: input.completed ?? false,
        lastParagraphIndex: input.lastParagraphIndex ?? 0,
      })
      .returning();
    session = created;
  }

  await updateReadingStreak(db, input.userId);
  return session;
}

async function updateReadingStreak(db: Database, userId: string) {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, userId),
  });
  if (!profile) return;

  const now = new Date();
  const last = profile.lastReadAt;
  let streak = profile.readingStreakDays;

  if (!last) {
    streak = 1;
  } else {
    const lastDay = new Date(last);
    lastDay.setHours(0, 0, 0, 0);
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.round(
      (today.getTime() - lastDay.getTime()) / (24 * 60 * 60 * 1000),
    );
    if (diffDays === 0) {
      streak = Math.max(1, streak);
    } else if (diffDays === 1) {
      streak += 1;
    } else {
      streak = 1;
    }
  }

  await db
    .update(profiles)
    .set({
      readingStreakDays: streak,
      lastReadAt: now,
      updatedAt: now,
    })
    .where(eq(profiles.id, userId));
}

export async function getProgressSummary(
  db: Database,
  userId: string,
): Promise<ProgressSummary> {
  const profile = await db.query.profiles.findFirst({
    where: eq(profiles.id, userId),
  });

  const vocab = await db.query.userVocabulary.findMany({
    where: eq(userVocabulary.userId, userId),
  });

  const knownWords = vocab.filter((v) => v.status === "known").length;
  const savedWords = vocab.filter((v) => v.status === "saved").length;
  const readWords = vocab.filter((v) => v.status === "read").length;
  const newWords = savedWords + readWords;

  const sessions = await db.query.readingSessions.findMany({
    where: eq(readingSessions.userId, userId),
  });
  const readingTimeSeconds = sessions.reduce(
    (sum, session) => sum + session.secondsRead,
    0,
  );
  const textsStarted = new Set(sessions.map((session) => session.textId)).size;
  const textsCompleted = new Set(
    sessions.filter((session) => session.completed).map((session) => session.textId),
  ).size;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6);
  weekAgo.setHours(0, 0, 0, 0);

  const recentSessions = await db.query.readingSessions.findMany({
    where: and(
      eq(readingSessions.userId, userId),
      gte(readingSessions.updatedAt, weekAgo),
    ),
  });

  const secondsByDay = new Map<string, number>();
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(weekAgo);
    d.setDate(weekAgo.getDate() + i);
    secondsByDay.set(dayLabel(d), 0);
  }
  for (const session of recentSessions) {
    const label = dayLabel(new Date(session.updatedAt));
    secondsByDay.set(
      label,
      (secondsByDay.get(label) ?? 0) + session.secondsRead,
    );
  }
  const maxSeconds = Math.max(1, ...secondsByDay.values());
  const weeklyReading = [...secondsByDay.entries()].map(([day, seconds]) => ({
    day,
    percent: Math.round((seconds / maxSeconds) * 100),
  }));

  const totalVocab = Math.max(1, knownWords + newWords);
  const review = Math.max(0, savedWords);
  const level = profile?.jlptLevel ?? "N5";
  const percent = Math.min(
    99,
    Math.round((knownWords / Math.max(50, knownWords + 20)) * 100),
  );

  return {
    knownWords,
    newWords: savedWords,
    savedWords,
    readingTime: formatReadingTime(readingTimeSeconds),
    readingTimeSeconds,
    streakDays: profile?.readingStreakDays ?? 0,
    textsStarted,
    textsCompleted,
    level: {
      current: level,
      next: nextLevel(level),
      goal: goalLevel(level),
      percent,
    },
    weeklyReading,
    vocabulary: {
      known: knownWords,
      knownPercent: Math.round((knownWords / totalVocab) * 100),
      new: newWords,
      newPercent: Math.round((newWords / totalVocab) * 100),
      review,
      reviewPercent: Math.round((review / totalVocab) * 100),
    },
  };
}
