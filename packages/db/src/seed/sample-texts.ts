import type { JlptLevel } from "@yomimasu/shared";

export type SampleTextSeed = {
  slug: string;
  title: string;
  titleJa: string;
  level: JlptLevel;
  topic: string;
  summary: string;
  body: string;
  translationEn: string;
  isFree: true;
  status: "published";
  estimatedMinutes: number;
  wordCount: number;
};

export const SAMPLE_TEXTS: SampleTextSeed[] = [
  {
    slug: "n5-morning-routine",
    title: "N5 Morning Routine",
    titleJa: "朝のルーティン",
    level: "N5",
    topic: "Daily Life",
    summary: "A short N5 story about waking up and getting ready for the day.",
    body: `朝七時に起きます。
まず顔を洗います。
それから朝ごはんを食べます。
パンとミルクです。
八時に家を出ます。
学校へ行きます。
友だちと話します。
今日もいい一日です。`,
    translationEn: `I wake up at 7 in the morning.
First, I wash my face.
Then I eat breakfast.
It is bread and milk.
I leave home at 8.
I go to school.
I talk with my friends.
Today is a good day too.`,
    isFree: true,
    status: "published",
    estimatedMinutes: 3,
    wordCount: 42,
  },
  {
    slug: "n4-spring-picnic",
    title: "N4 Spring Picnic",
    titleJa: "春のピクニック",
    level: "N4",
    topic: "Stories",
    summary: "An N4 picnic story about going to the park with friends.",
    body: `先週の土曜日、私は友達と公園へ行きました。
空は青くて、とてもいい天気でした。
私たちはお弁当を持って行きました。
桜の木の下で座りました。
友達はおいしいおにぎりを作りました。
私は果物を持って行きました。
みんなで食べながら話しました。
夕方まで公園にいました。
楽しい一日でした。`,
    translationEn: `Last Saturday, I went to the park with my friend.
The sky was blue, and the weather was very nice.
We brought a lunchbox.
We sat under a cherry blossom tree.
My friend made delicious rice balls.
I brought fruit.
We talked while eating together.
We stayed at the park until evening.
It was a fun day.`,
    isFree: true,
    status: "published",
    estimatedMinutes: 5,
    wordCount: 68,
  },
];
