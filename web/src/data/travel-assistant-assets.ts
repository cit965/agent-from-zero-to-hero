export interface TravelLessonScreenshot {
  src: string;
  alt: string;
  title: string;
  caption: string;
}

const TRAVEL_LESSON_SCREENSHOTS: Record<string, TravelLessonScreenshot[]> = {
  "lesson-5": [
    {
      src: "/travel-assistant/lesson-5/app_demo.png",
      alt: "LangChain旅行助手应用界面截图",
      title: "应用界面",
      caption: "启动 Flask 应用后，用户会先看到完整的旅行助手 Web 界面。",
    },
    {
      src: "/travel-assistant/lesson-5/chat_demo.png",
      alt: "LangChain旅行助手对话效果截图",
      title: "对话效果",
      caption: "输入旅行需求后，页面会展示 Agent 的回复与交互结果。",
    },
  ],
};

export function getTravelLessonScreenshots(lessonId: string) {
  return TRAVEL_LESSON_SCREENSHOTS[lessonId] ?? [];
}
