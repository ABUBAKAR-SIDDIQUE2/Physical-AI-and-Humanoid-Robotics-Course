/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  // Manually defined sidebar to strict pedagogical order
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Introduction to Physical AI',
      items: [
        'introduction-to-physical-ai/introduction-to-physical-ai'
      ],
    },
    {
      type: 'category',
      label: 'Robotic Nervous System (ROS 2)',
      items: [
        'robotic-nervous-system-ros2/robotic-nervous-system-ros2'
      ],
    },
    {
      type: 'category',
      label: 'Digital Twins (Gazebo & Unity)',
      items: [
        'digital-twin-gazebo-unity/digital-twin-gazebo-unity'
      ],
    },
    {
      type: 'category',
      label: 'AI Robot Brain (NVIDIA Isaac)',
      items: [
        'ai-robot-brain-nvidia-isaac/ai-robot-brain-nvidia-isaac'
      ],
    },
    {
      type: 'category',
      label: 'Humanoid Robot Development',
      items: [
        'humanoid-robot-development/humanoid-robot-development'
      ],
    },
    {
      type: 'category',
      label: 'Vision-Language-Action (VLA)',
      items: [
        'vision-language-action-vla/vision-language-action-vla'
      ],
    },
    {
      type: 'category',
      label: 'Conversational Robotics',
      items: [
        'conversational-robotics/conversational-robotics'
      ],
    },
    {
      type: 'category',
      label: 'Capstone: Autonomous Humanoid',
      items: [
        'capstone-autonomous-humanoid/capstone-autonomous-humanoid'
      ],
    },
    {
      type: 'category',
      label: 'Hardware Requirements',
      items: [
        'hardware-requirements/hardware-requirements'
      ],
    },
  ],
};

module.exports = sidebars;
