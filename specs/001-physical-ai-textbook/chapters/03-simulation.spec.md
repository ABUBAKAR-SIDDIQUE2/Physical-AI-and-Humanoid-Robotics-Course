# Chapter Spec: Digital Twins (Gazebo & Unity)

**ID**: `03-simulation`
**Title**: Digital Twins (Gazebo & Unity)
**Folder**: `digital-twin-gazebo-unity`
**Learning Outcomes**:
- Define "Digital Twin" and its importance in physical AI.
- Differentiate between Gazebo (physics-first) and Unity (visuals-first).
- Install Gazebo Garden/Fortress and understand its architecture.
- Import a robot model (URDF/SDF) into the simulation.
- Bridge ROS 2 messages to Gazebo using `ros_gz_bridge`.

## Structure
1. **Overview**: Simulation is not just for games; it's for safety and training.
2. **Why This Matters**: Crashing a $100k robot is expensive. Crashing a digital twin is free.
3. **Key Concepts**:
   - **URDF/SDF**: File formats for describing robots.
   - **Physics Engines**: Calculating gravity, friction, and collisions.
   - **The Bridge**: Connecting the ROS 2 nervous system to the simulated body.
4. **Detailed Explanations**:
   - Gazebo's Server-Client architecture.
   - The `ros_gz_bridge` package.
5. **Hands-On Activity**:
   - Visualize a robot in Gazebo.
   - Control the simulated robot via ROS 2 CLI.
6. **Example**: Setting up a simulation world with obstacles.
7. **Troubleshooting**: Graphics driver issues, real-time factor (RTF) drops.
8. **Summary**: You now have a virtual playground.
9. **Assessment**: Explain why we use URDF for ROS but SDF for Gazebo (usually).

## Diagrams
- Architecture: ROS 2 Node <--> ros_gz_bridge <--> Gazebo.
- URDF structure diagram (Links & Joints).

## Frontmatter
```yaml
---
id: digital-twin-gazebo-unity
title: "Digital Twins (Gazebo & Unity)"
sidebar_label: "Digital Twins (Gazebo & Unity)"
sidebar_position: 3
description: "Simulating physical AI with Gazebo and Unity."
keywords:
  - gazebo
  - unity
  - simulation
  - digital twin
  - urdf
---
```
