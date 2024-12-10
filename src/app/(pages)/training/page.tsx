'use client';

import { useState, useEffect } from 'react';
import { Training, Participant } from '@/app/actions/training';
import { 
  getTrainings, 
  addTraining, 
  deleteTraining, 
  markAsUnavailable,
  removeParticipant,
  updateTraining
} from '@/app/actions/training';
import Image from 'next/image';

interface UnavailableFormData {
  name: string;
  department: string;
  reason: string;
}

interface DeleteConfirmData {
  trainingId: number;
  verificationCode: string;
}

interface EditFormData {
  title: string;
  date: string;
  time: string;
  instructor: string;
  location: string;
  description: string;
}

export default function TrainingPage() {
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [selectedTraining, setSelectedTraining] = useState<Training | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUnavailableForm, setShowUnavailableForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmData, setDeleteConfirmData] = useState<DeleteConfirmData>({
    trainingId: 0,
    verificationCode: '',
  });
  const [unavailableFormData, setUnavailableFormData] = useState<UnavailableFormData>({
    name: '',
    department: '',
    reason: '',
  });
  const [newTraining, setNewTraining] = useState<Partial<Training>>({
    title: '',
    date: '',
    time: '',
    instructor: '',
    location: '',
    description: '',
  });
  const [expandedTrainingId, setExpandedTrainingId] = useState<number | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editFormData, setEditFormData] = useState<EditFormData & { id: number }>({
    id: 0,
    title: '',
    date: '',
    time: '',
    instructor: '',
    location: '',
    description: '',
  });

  // 初始化时从服务器加载数据
  useEffect(() => {
    const loadTrainings = async () => {
      const data = await getTrainings();
      setTrainings(data);
    };
    loadTrainings();
  }, []);

  const handleAddTraining = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const training = await addTraining(newTraining as Omit<Training, 'id'>);
      setTrainings([...trainings, training]);
      setNewTraining({
        title: '',
        date: '',
        time: '',
        instructor: '',
        location: '',
        description: '',
      });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding training:', error);
      alert('添加培训失败，请重试');
    }
  };

  const handleMarkUnavailable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTraining) return;

    try {
      await markAsUnavailable(selectedTraining.id, unavailableFormData);
      const updatedTrainings = await getTrainings();
      setTrainings(updatedTrainings);
      setUnavailableFormData({ name: '', department: '', reason: '' });
      setShowUnavailableForm(false);
      setSelectedTraining(null);
      alert('已添加到无法参加名单');
    } catch (error) {
      console.error('Error marking as unavailable:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('操作失败，请重试');
      }
    }
  };

  const handleRemoveParticipant = async (
    training: Training,
    participant: Participant
  ) => {
    if (window.confirm('确定要移除此记录吗？')) {
      try {
        await removeParticipant(training.id, {
          name: participant.name,
          department: participant.department,
        });
        const updatedTrainings = await getTrainings();
        setTrainings(updatedTrainings);
        alert('已移除记录');
      } catch (error) {
        console.error('Error removing participant:', error);
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert('移除失败，请重试');
        }
      }
    }
  };

  const handleDeleteClick = (id: number) => {
    setDeleteConfirmData({ trainingId: id, verificationCode: '' });
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmData.verificationCode !== '9999') {
      alert('验证码错误');
      return;
    }

    try {
      await deleteTraining(deleteConfirmData.trainingId);
      setTrainings(trainings.filter(training => training.id !== deleteConfirmData.trainingId));
      setShowDeleteConfirm(false);
      setDeleteConfirmData({ trainingId: 0, verificationCode: '' });
      alert('培训已删除');
    } catch (error) {
      console.error('Error deleting training:', error);
      alert('删除培训失败，请重试');
    }
  };

  const toggleTrainingExpand = (id: number) => {
    setExpandedTrainingId(expandedTrainingId === id ? null : id);
  };

  const handleEditClick = (training: Training) => {
    setEditFormData({
      id: training.id,
      title: training.title,
      date: training.date,
      time: training.time,
      instructor: training.instructor,
      location: training.location,
      description: training.description,
    });
    setShowEditForm(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { id, ...updates } = editFormData;
      await updateTraining(id, updates);
      const updatedTrainings = await getTrainings();
      setTrainings(updatedTrainings);
      setShowEditForm(false);
      alert('培训内容已更新');
    } catch (error) {
      console.error('Error updating training:', error);
      alert('更新失败，请重试');
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="relative h-[300px] mb-12">
        <Image
          src="/images/training.jpg"
          alt="Training background"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">培训日历</h1>
            <p className="text-xl max-w-2xl">安排或参与团队培训，提升专业技能</p>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">群组培训</h1>
            <p className="mt-4 text-lg text-gray-600">
              参与专业培训，提升技术能力，分享学习资源
            </p>
          </div>

          {/* 添加培训按钮 */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              添加培训
            </button>
          </div>

          {/* 添加培训表单 */}
          {showAddForm && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">添加新培训</h2>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleAddTraining} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      培训标题
                    </label>
                    <input
                      type="text"
                      required
                      value={newTraining.title}
                      onChange={(e) => setNewTraining({...newTraining, title: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        日期
                      </label>
                      <input
                        type="date"
                        required
                        value={newTraining.date}
                        onChange={(e) => setNewTraining({...newTraining, date: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        时间
                      </label>
                      <input
                        type="time"
                        required
                        value={newTraining.time}
                        onChange={(e) => setNewTraining({...newTraining, time: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        讲师
                      </label>
                      <input
                        type="text"
                        required
                        value={newTraining.instructor}
                        onChange={(e) => setNewTraining({...newTraining, instructor: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        地点
                      </label>
                      <input
                        type="text"
                        required
                        value={newTraining.location}
                        onChange={(e) => setNewTraining({...newTraining, location: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      培训描述
                    </label>
                    <textarea
                      required
                      value={newTraining.description}
                      onChange={(e) => setNewTraining({...newTraining, description: e.target.value})}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      添加
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 无法参加表单 */}
          {showUnavailableForm && selectedTraining && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">标记无法参加培训</h2>
                  <button
                    onClick={() => {
                      setShowUnavailableForm(false);
                      setSelectedTraining(null);
                      setUnavailableFormData({ name: '', department: '', reason: '' });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium">{selectedTraining.title}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedTraining.date} {selectedTraining.time}
                  </p>
                </div>
                <form onSubmit={handleMarkUnavailable} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      姓名
                    </label>
                    <input
                      type="text"
                      required
                      value={unavailableFormData.name}
                      onChange={(e) => setUnavailableFormData({...unavailableFormData, name: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      部门
                    </label>
                    <input
                      type="text"
                      required
                      value={unavailableFormData.department}
                      onChange={(e) => setUnavailableFormData({...unavailableFormData, department: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      原因
                    </label>
                    <textarea
                      required
                      value={unavailableFormData.reason}
                      onChange={(e) => setUnavailableFormData({...unavailableFormData, reason: e.target.value})}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUnavailableForm(false);
                        setSelectedTraining(null);
                        setUnavailableFormData({ name: '', department: '', reason: '' });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      确认提交
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 删除确认对话框 */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">删除确认</h2>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmData({ trainingId: 0, verificationCode: '' });
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  请输入验证码以确认删除操作
                </p>
                <input
                  type="password"
                  value={deleteConfirmData.verificationCode}
                  onChange={(e) => setDeleteConfirmData({
                    ...deleteConfirmData,
                    verificationCode: e.target.value
                  })}
                  placeholder="请输入验证码"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteConfirmData({ trainingId: 0, verificationCode: '' });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    确认删除
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 编辑培训表单 */}
          {showEditForm && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">编辑培训</h2>
                  <button
                    onClick={() => setShowEditForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      培训标题
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        日期
                      </label>
                      <input
                        type="date"
                        required
                        value={editFormData.date}
                        onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        时间
                      </label>
                      <input
                        type="time"
                        required
                        value={editFormData.time}
                        onChange={(e) => setEditFormData({...editFormData, time: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        讲师
                      </label>
                      <input
                        type="text"
                        required
                        value={editFormData.instructor}
                        onChange={(e) => setEditFormData({...editFormData, instructor: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        地点
                      </label>
                      <input
                        type="text"
                        required
                        value={editFormData.location}
                        onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      培训描述
                    </label>
                    <textarea
                      required
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowEditForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      保存修改
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 培训列表 */}
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {trainings.map((training) => (
              <div
                key={training.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 group">
                      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                        {training.title}
                        <button
                          onClick={() => handleEditClick(training)}
                          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
                          title="编辑培训"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </h2>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(training.id)}
                      className="text-red-600 hover:text-red-700"
                      title="删除培训"
                    >
                      ✕
                    </button>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {[
                      { label: '时间', value: `${training.date} ${training.time}` },
                      { label: '讲师', value: training.instructor },
                      { label: '地点', value: training.location },
                    ].map((item, index) => (
                      <div key={index} className="text-sm text-gray-600 group">
                        <div className="flex items-center">
                          <span className="font-medium">{item.label}：</span>
                          <span>{item.value}</span>
                          <button
                            onClick={() => handleEditClick(training)}
                            className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
                            title={`编辑${item.label}`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 group">
                    <div className="flex items-center">
                      <p className="text-gray-600">{training.description}</p>
                      <button
                        onClick={() => handleEditClick(training)}
                        className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
                        title="编辑描述"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="mt-6">
                    {training.participants && training.participants.length > 0 && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">无法参加人员</h3>
                        <div className="space-y-2">
                          {training.participants.map((participant, index) => (
                            <div 
                              key={index} 
                              className="flex items-start space-x-3 text-sm bg-gray-50 p-2 rounded"
                            >
                              <div className="min-w-[100px] font-medium text-gray-900">
                                {participant.name}
                              </div>
                              <div className="min-w-[120px] text-gray-600">
                                {participant.department}
                              </div>
                              <div className="flex-1 text-gray-600">
                                {participant.reason}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={() => {
                          setSelectedTraining(training);
                          setShowUnavailableForm(true);
                        }}
                      >
                        无法参加
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 培训日历视图 */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900">培训日历</h2>
            <div className="mt-6 bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  {trainings
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((training) => (
                      <div key={training.id} className={`bg-white border border-gray-200 rounded-lg transition-all duration-200 ${
                        expandedTrainingId === training.id ? 'shadow-md' : 'hover:shadow-sm'
                      }`}>
                        {/* 主要信息 - 始终显示 */}
                        <div className="p-4 flex items-center justify-between">
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => toggleTrainingExpand(training.id)}
                          >
                            <div className="flex items-center space-x-6">
                              <div className="w-32">
                                <h3 className="text-xs font-medium text-gray-500 uppercase">日期</h3>
                                <p className="text-sm font-medium text-gray-900 mt-1">{training.date}</p>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xs font-medium text-gray-500 uppercase">培训主题</h3>
                                <p className="text-base font-medium text-gray-900 mt-1">{training.title}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            {training.participants && training.participants.length > 0 && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {training.participants.length}人无法参加
                              </span>
                            )}
                            <button
                              onClick={() => handleEditClick(training)}
                              className="text-gray-600 hover:text-gray-700"
                              title="编辑培训"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(training.id)}
                              className="text-red-600 hover:text-red-700"
                              title="删除培训"
                            >
                              ✕
                            </button>
                            <button
                              onClick={() => toggleTrainingExpand(training.id)}
                              className={`transform transition-transform duration-200 ${
                                expandedTrainingId === training.id ? 'rotate-180' : ''
                              }`}
                            >
                              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* 详细信息 - 展开时显示 */}
                        <div 
                          className={`overflow-hidden transition-all duration-200 ${
                            expandedTrainingId === training.id ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="px-4 pb-4 border-t border-gray-100">
                            <div className="grid grid-cols-3 gap-6 mt-4">
                              {[
                                { label: '时间', value: training.time },
                                { label: '讲师', value: training.instructor },
                                { label: '地点', value: training.location },
                              ].map((item, index) => (
                                <div key={index} className="group relative">
                                  <h3 className="text-xs font-medium text-gray-500 uppercase">
                                    {item.label}
                                  </h3>
                                  <div className="flex items-center mt-1">
                                    <p className="text-sm text-gray-900">{item.value}</p>
                                    <button
                                      onClick={() => handleEditClick(training)}
                                      className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
                                      title={`编辑${item.label}`}
                                    >
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="mt-4 group">
                              <div className="flex items-center justify-between">
                                <h3 className="text-xs font-medium text-gray-500 uppercase">培训描述</h3>
                                <button
                                  onClick={() => handleEditClick(training)}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
                                  title="编辑描述"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {training.description}
                              </p>
                            </div>

                            {training.participants && training.participants.length > 0 && (
                              <div className="mt-4">
                                <h3 className="text-xs font-medium text-gray-500 uppercase mb-2">无法参加人员</h3>
                                <div className="space-y-2">
                                  {training.participants.map((participant, index) => (
                                    <div 
                                      key={index}
                                      className="flex items-start space-x-3 text-sm bg-gray-50 p-2 rounded"
                                    >
                                      <div className="min-w-[100px] font-medium text-gray-900">
                                        {participant.name}
                                      </div>
                                      <div className="min-w-[120px] text-gray-600">
                                        {participant.department}
                                      </div>
                                      <div className="flex-1 text-gray-600">
                                        {participant.reason}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                              <span>最后更新：{new Date(training.id).toLocaleString('zh-CN')}</span>
                              <button
                                onClick={() => {
                                  setSelectedTraining(training);
                                  setShowUnavailableForm(true);
                                }}
                                className="text-red-600 hover:text-red-700 font-medium"
                              >
                                标记无法参加
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 