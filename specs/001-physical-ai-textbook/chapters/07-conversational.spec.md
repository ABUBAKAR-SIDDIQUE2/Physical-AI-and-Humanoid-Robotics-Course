# Chapter Spec: Conversational Robotics

**ID**: `07-conversational`
**Title**: Conversational Robotics
**Folder**: `conversational-robotics`
**Learning Outcomes**:
- Implement a full voice interaction pipeline: Speech-to-Text (STT) -> LLM -> Text-to-Speech (TTS).
- Integrate "Wake Word" detection to trigger robot attention.
- Design a conversational agent that can control robot hardware.
- Understand the challenges of audio processing on moving platforms (noise cancellation).

## Structure
1. **Overview**: Giving the robot a voice and ears.
2. **Why This Matters**: Natural language is the most intuitive interface for humans.
3. **Key Concepts**:
   - **Wake Word**: Efficiently listening for "Hey Robot" without burning tokens.
   - **Latency**: The critical "time-to-response" metric.
   - **Context**: Remembering previous turns in the conversation.
4. **Detailed Explanations**:
   - OpenAI Whisper for robust STT.
   - ElevenLabs/Coqui for expressive TTS.
   - LangChain for managing dialogue history.
5. **Hands-On Activity**:
   - Install `pyaudio` and `openai-whisper`.
   - Create a ROS 2 node that listens for "Move Forward" and executes it.
6. **Example**: A receptionist robot that greets visitors.
7. **Troubleshooting**: Fan noise interfering with the microphone.
8. **Summary**: The robot is now a social actor.
9. **Assessment**: Design a dialogue flow for a robot ordering coffee.

## Diagrams
- Audio Pipeline: Microphone -> VAD -> STT -> LLM -> TTS -> Speaker.
- State Machine for conversation (Listening, Thinking, Speaking).

## Frontmatter
```yaml
---
id: conversational-robotics
title: "Conversational Robotics"
sidebar_label: "Conversational Robotics"
sidebar_position: 7
description: "Building voice interfaces for embodied agents."
keywords:
  - whisper
  - tts
  - stt
  - voice control
  - hri
---
```
