'use server';

import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src/app/api/db/trainings.json');

export interface Participant {
  name: string;
  department: string;
  status: 'unavailable';
  reason: string;
}

export interface Training {
  id: number;
  title: string;
  date: string;
  time: string;
  instructor: string;
  location: string;
  description: string;
  materials: { name: string; url: string; }[];
  participants?: Participant[];
}

// 读取所有培训数据
export async function getTrainings(): Promise<Training[]> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    const { trainings } = JSON.parse(data);
    return trainings;
  } catch (error) {
    console.error('Error reading trainings:', error);
    return [];
  }
}

// 保存所有培训数据
async function saveTrainings(trainings: Training[]) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify({ trainings }, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving trainings:', error);
    throw new Error('Failed to save trainings');
  }
}

// 添加新培训
export async function addTraining(training: Omit<Training, 'id'>) {
  const trainings = await getTrainings();
  const newTraining = {
    ...training,
    id: Date.now(),
    participants: [],
    materials: [],
  };
  trainings.push(newTraining);
  await saveTrainings(trainings);
  return newTraining;
}

// 删除培训
export async function deleteTraining(id: number) {
  const trainings = await getTrainings();
  const updatedTrainings = trainings.filter(t => t.id !== id);
  await saveTrainings(updatedTrainings);
}

// 标记无法参加
export async function markAsUnavailable(
  trainingId: number,
  participant: { name: string; department: string; reason: string }
) {
  const trainings = await getTrainings();
  const updatedTrainings = trainings.map(training => {
    if (training.id === trainingId) {
      // 检查是否已经在列表中
      const isAlreadyListed = (training.participants || []).some(
        p => p.name === participant.name && p.department === participant.department
      );

      if (isAlreadyListed) {
        throw new Error('您已经在名单中了');
      }

      return {
        ...training,
        participants: [
          ...(training.participants || []),
          { ...participant, status: 'unavailable' as const },
        ],
      };
    }
    return training;
  });
  await saveTrainings(updatedTrainings);
}

// 取消无法参加标记
export async function removeParticipant(
  trainingId: number,
  participant: { name: string; department: string }
) {
  const trainings = await getTrainings();
  const updatedTrainings = trainings.map(training => {
    if (training.id === trainingId) {
      const participants = training.participants || [];
      const participantIndex = participants.findIndex(
        p => p.name === participant.name && p.department === participant.department
      );

      if (participantIndex === -1) {
        throw new Error('未找到记录');
      }

      const updatedParticipants = [
        ...participants.slice(0, participantIndex),
        ...participants.slice(participantIndex + 1)
      ];

      return {
        ...training,
        participants: updatedParticipants,
      };
    }
    return training;
  });
  await saveTrainings(updatedTrainings);
}

// 更新培训内容
export async function updateTraining(
  id: number,
  updates: {
    title: string;
    date: string;
    time: string;
    instructor: string;
    location: string;
    description: string;
  }
) {
  const trainings = await getTrainings();
  const updatedTrainings = trainings.map(training => {
    if (training.id === id) {
      return {
        ...training,
        ...updates,
      };
    }
    return training;
  });
  await saveTrainings(updatedTrainings);
} 