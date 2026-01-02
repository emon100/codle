---
description: 如何更新和维护编程挑战题目 (How to update and maintain programming quiz questions)
---

# 更新题目工作流 (Update Questions Workflow)

本指南旨在帮助维护者持续更新 CodeQuiz 的题目库，确保题目质量符合“深入理解”而非“死记硬背”的标准。

## 1. 题目来源 (Sources)

*   **Nowcoder (牛客网)**: [面试题库 TOP101](https://m.nowcoder.com/mianshi/top)。关注前端、后端、系统架构等分类。
*   **MDN / Web.dev**: 关注性能优化、浏览器渲染、JavaScript 规范中的冷知识。
*   **Production Bugs**: 记录日常开发中遇到的“玄学”问题或性能陷阱。

## 2. 题目要求 (Quality Standards)

### A. 核心理念：拒绝八股，直击本质
*   **避免**: 纯定义题目（例如：“CPU 的全称是什么？”）。
*   **提倡**: 原理/场景题目（例如：“为什么 CSS 动画建议用 transform 而不是 width？”）。

### B. 双语支持 (Internationalization)
*   所有题目必须同时提供 `en` (英文) 和 `cn` (中文) 版本。
*   术语保持一致，例如 JS 里的 `Closure` 在中文版中应对应 `闭包`。

### C. 有趣且深刻的解析 (Engaging Explanations)
*   解析不应只是“对还是错”，而应包含：
    *   **Why**: 为什么这个选项是对的/错的。
    *   **Pro-tip**: 生产环境中的最佳实践。
    *   **Humor**: 适当的幽默或吐槽，让学习过程更轻松。

## 3. 题目格式 (Data Format)

题目存储在 `src/data/questions.json` 中。

### 如何控制每日题目 (Controlling Daily Content)
*   **手动排维护**: 在题目 JSON 中添加 `"scheduled_date": "2026-01-02"` 字段。
*   **逻辑**: 系统每天会首先选取 `scheduled_date` 与今天相符的题目。如果不足 10 道，则会从题库中随机抽取补充。
*   **用途**: 你可以提前为特定节日或活动安排特定题目。

```json
{
  "id": "unique-id-here",
  "scheduled_date": "YYYY-MM-DD", // 可选：指定该题目出现的日期
  "category": { "en": "Topic", "cn": "分类" },
  "difficulty": "Easy/Medium/Hard",
  "question": {
    "en": "Question text in English?",
    "cn": "中文题目描述？"
  },
  "options": {
    "en": ["Option A", "Option B", "Option C", "Option D"],
    "cn": ["选项 A", "选项 B", "选项 C", "选项 D"]
  },
  "answer": 0,
  "explanation": {
    "en": "Deep dive explanation with a humor touch.",
    "cn": "深入浅出的原理解析，带点幽默感。"
  }
}
```

## 4. 更新步骤 (Steps)

1.  **调研**: 从 Nowcoder 或日常开发中选取一个高频考点。
2.  **设计**: 构造一个能体现底层原理的代码段或场景题目。
3.  **编写**: 按照上述 JSON 模板编写双语版。
4.  **测试**: 使用 `?dev=1` 开发模式查看新题目在 `ShareCard` 上的渲染效果。
5.  **提交**: 更新 `src/data/questions.json` 并发布。
