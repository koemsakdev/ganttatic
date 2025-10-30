import React, { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, Trash2, GripVertical } from 'lucide-react';

const GanttPlanner = () => {
  const [tasks, setTasks] = useState();

  const [projectTitle, setProjectTitle] = useState('Project lead');
  const [viewStartDate] = useState(new Date('2024-10-14'));

  const generateWeeks = () => {
    const weeks = [];
    const startDate = new Date(viewStartDate);
    
    for (let i = 0; i < 8; i++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      weeks.push({
        start: weekStart,
        end: weekEnd,
        days: Array.from({ length: 7 }, (_, j) => {
          const day = new Date(weekStart);
          day.setDate(weekStart.getDate() + j);
          return day;
        })
      });
    }
    return weeks;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const calculateBarPosition = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const viewStart = new Date(viewStartDate);
    
    const dayWidth = 30;
    const startDiff = Math.floor((start - viewStart) / (1000 * 60 * 60 * 24));
    const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    return {
      left: startDiff * dayWidth,
      width: duration * dayWidth
    };
  };

  const toggleExpand = (taskId) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, expanded: !t.expanded } : t));
  };

  const hasChildren = (taskId) => {
    return tasks.some(t => t.parentId === taskId);
  };

  const addTask = (parentId = null) => {
    const parent = parentId ? tasks.find(t => t.id === parentId) : null;
    const level = parent ? parent.level + 1 : 0;
    const type = level === 0 ? 'main' : 'subtask';
    
    // Color gets darker with each level
    const colors = ['#E1BEE7', '#9C27B0', '#7B1FA2', '#6A1B9A', '#4A148C'];
    const color = colors[Math.min(level, colors.length - 1)];

    const newTask = {
      id: Date.now(),
      name: type === 'main' ? 'New Phase' : 'New Task',
      type: type,
      assignedTo: '',
      progress: 0,
      startDate: '',
      endDate: '',
      color: color,
      expanded: true,
      parentId: parentId,
      level: level
    };
    
    if (parentId) {
      const parentIndex = tasks.findIndex(t => t.id === parentId);
      let insertIndex = parentIndex + 1;
      // Find last descendant of parent
      const findLastDescendant = (pid, startIdx) => {
        let lastIdx = startIdx;
        for (let i = startIdx; i < tasks.length; i++) {
          if (tasks[i].parentId === pid) {
            lastIdx = i;
            const childLastIdx = findLastDescendant(tasks[i].id, i + 1);
            if (childLastIdx > lastIdx) lastIdx = childLastIdx;
          }
        }
        return lastIdx;
      };
      insertIndex = findLastDescendant(parentId, parentIndex + 1) + 1;
      
      const newTasks = [...tasks];
      newTasks.splice(insertIndex, 0, newTask);
      setTasks(newTasks);
      
      // Expand parent if not expanded
      if (parent && !parent.expanded) {
        setTasks(prev => prev.map(t => t.id === parentId ? { ...t, expanded: true } : t));
      }
    } else {
      setTasks([...tasks, newTask]);
    }
  };

  const deleteTask = (taskId) => {
    // Delete task and all its descendants
    const getAllDescendants = (pid) => {
      const descendants = [pid];
      tasks.forEach(t => {
        if (t.parentId === pid) {
          descendants.push(...getAllDescendants(t.id));
        }
      });
      return descendants;
    };
    
    const toDelete = getAllDescendants(taskId);
    setTasks(tasks.filter(t => !toDelete.includes(t.id)));
  };

  const updateTask = (taskId, field, value) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, [field]: value } : t));
  };

  const getVisibleTasks = () => {
    const visible = [];
    
    const addTaskAndChildren = (task) => {
      visible.push(task);
      if (task.expanded) {
        const children = tasks.filter(t => t.parentId === task.id);
        children.forEach(child => addTaskAndChildren(child));
      }
    };
    
    const topLevel = tasks.filter(t => !t.parentId);
    topLevel.forEach(task => addTaskAndChildren(task));
    
    return visible;
  };

  const weeks = generateWeeks();
  const visibleTasks = getVisibleTasks();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4 shadow-sm">
        <input
          type="text"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          className="text-2xl font-semibold text-blue-600 bg-transparent border-none outline-none"
        />
      </div>

      {/* Main Content */}
      <div className="flex overflow-hidden">
        {/* Left Panel - Task List */}
        <div className="bg-white border-r shadow-sm" style={{ minWidth: '700px', width: '700px' }}>
          {/* Column Headers */}
          <div className="flex bg-gray-100 border-b text-xs font-semibold text-gray-700 sticky top-0">
            <div className="w-8 p-3 border-r"></div>
            <div className="w-64 p-3 border-r">TASK NAME</div>
            <div className="w-40 p-3 border-r">ASSIGNED TO</div>
            <div className="w-28 p-3 border-r">PROGRESS</div>
            <div className="w-32 p-3 border-r">START DATE</div>
            <div className="w-32 p-3 border-r">END DATE</div>
            <div className="w-16 p-3">ACTION</div>
          </div>

          {/* Task Rows */}
          <div>
            {visibleTasks.map(task => (
              <div
                key={task.id}
                className="flex items-center border-b hover:bg-gray-50"
                style={{ 
                  backgroundColor: task.level === 0 ? task.color : 'white'
                }}
              >
                {/* Drag Handle */}
                <div className="w-8 p-2 border-r flex items-center justify-center cursor-move">
                  <GripVertical size={16} className="text-gray-400" />
                </div>

                {/* Task Name */}
                <div className="w-64 p-2 flex items-center gap-1 border-r" style={{ paddingLeft: `${8 + task.level * 24}px` }}>
                  {hasChildren(task.id) && (
                    <button onClick={() => toggleExpand(task.id)} className="p-1 hover:bg-gray-200 rounded flex-shrink-0">
                      {task.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  )}
                  <input
                    type="text"
                    value={task.name}
                    onChange={(e) => updateTask(task.id, 'name', e.target.value)}
                    className={`flex-1 px-2 py-1 bg-transparent border border-transparent hover:border-gray-300 rounded outline-none text-sm ${
                      task.level === 0 ? 'font-semibold' : ''
                    }`}
                  />
                </div>

                {/* Assigned To */}
                <div className="w-40 p-2 border-r">
                  <input
                    type="text"
                    value={task.assignedTo}
                    onChange={(e) => updateTask(task.id, 'assignedTo', e.target.value)}
                    className="w-full px-2 py-1 bg-transparent border border-transparent hover:border-gray-300 rounded outline-none text-sm"
                    placeholder={task.level === 0 ? '' : 'Assign...'}
                  />
                </div>

                {/* Progress */}
                <div className="w-28 p-2 border-r">
                  {task.level > 0 && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={task.progress}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          updateTask(task.id, 'progress', Math.min(100, Math.max(0, val)));
                        }}
                        className="w-14 px-2 py-1 border border-gray-300 rounded outline-none text-sm text-center"
                        min="0"
                        max="100"
                      />
                      <span className="text-sm text-gray-600">%</span>
                    </div>
                  )}
                </div>

                {/* Start Date */}
                <div className="w-32 p-2 border-r">
                  {task.level > 0 && (
                    <input
                      type="date"
                      value={task.startDate}
                      onChange={(e) => updateTask(task.id, 'startDate', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded outline-none text-xs"
                    />
                  )}
                </div>

                {/* End Date */}
                <div className="w-32 p-2 border-r">
                  {task.level > 0 && (
                    <input
                      type="date"
                      value={task.endDate}
                      onChange={(e) => updateTask(task.id, 'endDate', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded outline-none text-xs"
                    />
                  )}
                </div>

                {/* Actions */}
                <div className="w-16 p-2 flex items-center gap-1">
                  <button
                    onClick={() => addTask(task.id)}
                    className="p-1 hover:bg-blue-100 rounded text-blue-600"
                    title="Add subtask"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1 hover:bg-red-100 rounded text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Phase Button */}
          <button
            onClick={() => addTask(null)}
            className="w-full p-3 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2 font-medium"
          >
            <Plus size={18} />
            Add New Phase
          </button>
        </div>

        {/* Right Panel - Timeline */}
        <div className="flex-1 overflow-x-auto bg-white">
          {/* Week Headers */}
          <div className="flex border-b bg-gray-100 sticky top-0">
            {weeks.map((week, i) => (
              <div key={i} className="border-r">
                <div className="text-center text-xs font-semibold p-2 border-b bg-gray-200">
                  {formatDate(week.start)} - {formatDate(week.end)}
                </div>
                <div className="flex">
                  {week.days.map((day, j) => (
                    <div
                      key={j}
                      className="text-center text-xs border-r p-2"
                      style={{
                        width: '30px',
                        backgroundColor: day.getDay() === 0 || day.getDay() === 6 ? '#f3f4f6' : 'white'
                      }}
                    >
                      <div className="font-semibold">{['S','M','T','W','T','F','S'][day.getDay()]}</div>
                      <div className="text-gray-500">{day.getDate()}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Timeline Bars */}
          <div className="relative">
            {/* Grid Background */}
            <div className="absolute inset-0 flex pointer-events-none">
              {weeks.map((week, i) => (
                <div key={i} className="flex border-r">
                  {week.days.map((day, j) => (
                    <div
                      key={j}
                      className="border-r"
                      style={{
                        width: '30px',
                        backgroundColor: day.getDay() === 0 || day.getDay() === 6 ? '#f9fafb' : 'transparent'
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Task Bars */}
            {visibleTasks.map(task => {
              const position = calculateBarPosition(task.startDate, task.endDate);
              return (
                <div
                  key={task.id}
                  className="relative border-b"
                  style={{ 
                    height: '45px',
                    backgroundColor: task.level === 0 ? task.color : 'transparent'
                  }}
                >
                  {position && task.level > 0 && (
                    <div
                      className="absolute top-1/2 transform -translate-y-1/2 rounded shadow-sm flex items-center px-2"
                      style={{
                        left: `${position.left}px`,
                        width: `${position.width}px`,
                        backgroundColor: task.color,
                        height: '28px',
                        minWidth: '30px'
                      }}
                    >
                      <div
                        className="absolute left-0 top-0 h-full rounded"
                        style={{
                          width: `${task.progress}%`,
                          backgroundColor: 'rgba(255, 255, 255, 0.5)'
                        }}
                      />
                      <span className="relative text-xs text-white font-medium z-10">
                        {task.progress > 0 ? `${task.progress}%` : ''}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttPlanner; 