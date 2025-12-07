# Chapter Spec: Vision-Language-Action (VLA)

**ID**: `06-vla`
**Title**: Vision-Language-Action (VLA)
**Folder**: `vision-language-action-vla`
**Learning Outcomes**:
- Define Vision-Language-Action (VLA) models and their significance.
- Differentiate between LLMs (Text-only) and VLMs (Text + Image).
- Implement a cloud-based VLA pipeline using APIs (OpenAI/Gemini).
- Explore open weights VLA models (RT-2, OpenVLA).
- Connect high-level reasoning to low-level ROS 2 actions.

## Structure
1. **Overview**: Robots that understand "Pick up the red apple".
2. **Why This Matters**: Hard-coding rules is brittle. VLAs provide common sense.
3. **Key Concepts**:
   - **Multimodality**: Processing text and pixels together.
   - **Action Tokenization**: Converting "Move Arm" into numbers the model outputs.
   - **Grounding**: Linking abstract words to physical objects.
4. **Detailed Explanations**:
   - The architecture of a VLA (ViT + Transformer Decoder).
   - Prompt Engineering for Robotics.
5. **Hands-On Activity**:
   - Capture an image from the robot's camera.
   - Send it to a VLM with the prompt "What should I do to clean this table?"
   - Parse the text response into a function call.
6. **Example**: Sorting trash vs. recyclables using visual reasoning.
7. **Troubleshooting**: Latency issues with cloud models.
8. **Summary**: The brain gets a cortex.
9. **Assessment**: Design a prompt that prevents the robot from picking up dangerous objects.

## Diagrams
- VLA Inference Flow: Camera -> VLM -> Text Action -> ROS 2 Code.
- Semantic Grounding diagram.

## Frontmatter
```yaml
---
id: vision-language-action-vla
title: "Vision-Language-Action (VLA)"
sidebar_label: "Vision-Language-Action (VLA)"
sidebar_position: 6
description: "Integrating Generative AI with robotics control."
keywords:
  - vla
  - generative ai
  - llm
  - robotics
  - transformer
---
```
