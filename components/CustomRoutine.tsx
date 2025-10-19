import React, { useState, useEffect } from 'react';
import { CustomRoutineStep, RoutineStep } from '../types';
import { ClockIcon } from './icons/ClockIcon';
import { TrashIcon } from './icons/TrashIcon';
import { EditIcon } from './icons/EditIcon';
import { SaveIcon } from './icons/SaveIcon';
import { PlusIcon } from './icons/PlusIcon';
import { AnimatedText } from './AnimatedText';
import * as routineService from '../services/routineService';

interface RoutineCardProps {
  title: string;
  steps: CustomRoutineStep[];
  onAdd: (text: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newText: string) => void;
  onToggleEdit: (id: string) => void;
}

const RoutineCard: React.FC<RoutineCardProps> = ({
  title,
  steps,
  onAdd,
  onDelete,
  onUpdate,
  onToggleEdit,
}) => {
    const [newStepText, setNewStepText] = useState('');
    const [editingText, setEditingText] = useState('');

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if(newStepText.trim()) {
            onAdd(newStepText.trim());
            setNewStepText('');
        }
    };

    const handleStartEdit = (id: string, currentText: string) => {
        setEditingText(currentText);
        onToggleEdit(id);
    };

    const handleUpdate = (id: string) => {
        if (editingText.trim()) {
            onUpdate(id, editingText.trim());
        } else {
            // If user clears the text, revert to the original text and exit edit mode.
            const originalStep = steps.find(s => s.id === id);
            if (originalStep) {
                onUpdate(id, originalStep.text);
            }
        }
    };

    return (
        <div
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 h-full flex flex-col animate-fade-in"
        >
            <h3 className="text-xl font-bold text-rose-400 mb-4">{title}</h3>
            <div className="space-y-3 flex-grow mb-4 overflow-y-auto">
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className="flex items-center gap-3 bg-gray-900/50 p-3 rounded-lg animate-fade-in"
                    >
                        <span className="text-sm font-bold text-rose-400">{index + 1}.</span>
                        {step.isEditing ? (
                            <input
                                type="text"
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                onBlur={() => handleUpdate(step.id)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleUpdate(step.id);
                                    } else if (e.key === 'Escape') {
                                        onToggleEdit(step.id);
                                    }
                                }}
                                className="flex-grow bg-transparent border-b border-rose-500 focus:outline-none text-gray-200"
                                autoFocus
                            />
                        ) : (
                            <p className="flex-grow text-gray-300 break-all">{step.text}</p>
                        )}
                        <button onClick={() => step.isEditing ? handleUpdate(step.id) : handleStartEdit(step.id, step.text)} className="text-gray-400 hover:text-white transition-colors p-1 transform active:scale-90">
                            {step.isEditing ? <SaveIcon className="w-5 h-5" /> : <EditIcon className="w-5 h-5" />}
                        </button>
                        <button onClick={() => onDelete(step.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1 transform active:scale-90">
                           <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}
                 {steps.length === 0 && <p className="text-gray-500 text-center py-4">Your routine is empty. Add a step below!</p>}
            </div>
            <form onSubmit={handleAdd} className="flex gap-2 mt-auto">
                <input
                    type="text"
                    value={newStepText}
                    onChange={(e) => setNewStepText(e.target.value)}
                    placeholder="Add a new step..."
                    className="flex-grow bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-rose-500 text-sm"
                />
                <button type="submit" className="bg-rose-500 text-white p-2 rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 transform active:scale-95" disabled={!newStepText.trim()}>
                    <PlusIcon className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
};

interface CustomRoutineProps {
  aiGeneratedRoutine?: { am: RoutineStep[], pm: RoutineStep[] };
}

export const CustomRoutine: React.FC<CustomRoutineProps> = ({ aiGeneratedRoutine }) => {
    const [amRoutine, setAmRoutine] = useState<CustomRoutineStep[]>([]);
    const [pmRoutine, setPmRoutine] = useState<CustomRoutineStep[]>([]);
    const [amReminder, setAmReminder] = useState('');
    const [pmReminder, setPmReminder] = useState('');
    const [notificationPermission, setNotificationPermission] = useState('default');
    const [showAmSaveConfirm, setShowAmSaveConfirm] = useState(false);
    const [showPmSaveConfirm, setShowPmSaveConfirm] = useState(false);
    
    useEffect(() => {
        const loadData = async () => {
            setNotificationPermission(Notification.permission);
            const [{ am, pm }, { am: amRem, pm: pmRem }] = await Promise.all([
                routineService.getRoutines(),
                routineService.getReminders(),
            ]);
            setAmRoutine(am);
            setPmRoutine(pm);
            setAmReminder(amRem);
            setPmReminder(pmRem);
        };
        loadData();
    }, []);

    const handleReminderChange = (type: 'am' | 'pm') => async (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      if (type === 'am') {
        setAmReminder(value);
        if (value) {
            setShowAmSaveConfirm(true);
            setTimeout(() => setShowAmSaveConfirm(false), 2000);
        }
      } else {
        setPmReminder(value);
        if (value) {
            setShowPmSaveConfirm(true);
            setTimeout(() => setShowPmSaveConfirm(false), 2000);
        }
      }
      await routineService.saveReminder(type, value);
    };

    const createCrudHandlers = (
        routine: CustomRoutineStep[], 
        setRoutine: React.Dispatch<React.SetStateAction<CustomRoutineStep[]>>,
        saveRoutine: (r: CustomRoutineStep[]) => Promise<void>
    ) => ({
        add: async (text: string) => {
            const newStep: CustomRoutineStep = { id: Date.now().toString(), text, isEditing: false };
            const updatedRoutine = [...routine, newStep];
            setRoutine(updatedRoutine);
            await saveRoutine(updatedRoutine);
        },
        delete: async (id: string) => {
            const updatedRoutine = routine.filter(step => step.id !== id);
            setRoutine(updatedRoutine);
            await saveRoutine(updatedRoutine);
        },
        update: async (id: string, newText: string) => {
            const updatedRoutine = routine.map(step => step.id === id ? { ...step, text: newText, isEditing: false } : step);
            setRoutine(updatedRoutine);
            await saveRoutine(updatedRoutine);
        },
        toggleEdit: (id: string) => {
            setRoutine(prev => prev.map(step => step.id === id ? { ...step, isEditing: !step.isEditing } : { ...step, isEditing: false }));
        }
    });

    const amHandlers = createCrudHandlers(amRoutine, setAmRoutine, routineService.saveAmRoutine);
    const pmHandlers = createCrudHandlers(pmRoutine, setPmRoutine, routineService.savePmRoutine);

    const handleImportAiRoutine = async () => {
        if (!aiGeneratedRoutine) return;
        const newAmSteps = aiGeneratedRoutine.am.map(step => ({ id: `ai-am-${Date.now()}-${Math.random()}`, text: `${step.step}: ${step.description}`, isEditing: false }));
        const newPmSteps = aiGeneratedRoutine.pm.map(step => ({ id: `ai-pm-${Date.now()}-${Math.random()}`, text: `${step.step}: ${step.description}`, isEditing: false }));
        
        const updatedAmRoutine = [...amRoutine, ...newAmSteps];
        const updatedPmRoutine = [...pmRoutine, ...newPmSteps];

        setAmRoutine(updatedAmRoutine);
        setPmRoutine(updatedPmRoutine);
        
        await Promise.all([
            routineService.saveAmRoutine(updatedAmRoutine),
            routineService.savePmRoutine(updatedPmRoutine)
        ]);

        alert('AI routine has been added! You can now customize it.');
    };

    const handleRequestNotifications = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            setNotificationPermission(permission);
            if (permission === 'granted') {
                 new Notification("EverGlow Reminders Active!", {
                    body: "You'll now receive reminders for your skincare routines.",
                });
            } else {
                alert("Notifications are disabled. You can enable them in your browser settings.");
            }
        } else {
             alert("This browser does not support desktop notification");
        }
    };
    
    useEffect(() => {
       const interval = setInterval(() => {
           if (notificationPermission !== 'granted') return;
           
           const now = new Date();
           const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
           
           if (amReminder && amReminder === currentTime) {
               new Notification("☀️ Good Morning!", { body: "Time for your AM skincare routine. Let's start the day fresh!" });
           }
           if (pmReminder && pmReminder === currentTime) {
               new Notification("🌙 Good Evening!", { body: "Time for your PM skincare routine. Wind down and care for your skin." });
           }
       }, 60000); 
       
       return () => clearInterval(interval);
    }, [amReminder, pmReminder, notificationPermission]);

    return (
        <div
            className="w-full max-w-4xl space-y-8 animate-fade-in"
        >
            <div className="text-center">
                 <AnimatedText text="My Skincare Routine" className="text-3xl font-bold text-gray-100 mb-2" />
                 <p className="text-gray-400">Build your personal regimen and set daily reminders to stay consistent.</p>
                 {aiGeneratedRoutine && (amRoutine.length === 0 || pmRoutine.length === 0) && (
                     <button
                        onClick={handleImportAiRoutine}
                        className="mt-4 bg-rose-500/20 text-rose-300 font-semibold py-2 px-4 rounded-lg hover:bg-rose-500/40 transition-colors transform hover:scale-105 active:scale-95">
                        Import My AI-Generated Routine
                     </button>
                 )}
            </div>
            
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 animate-fade-in">
                <h3 className="text-xl font-bold text-rose-400 mb-4 flex items-center gap-2"><ClockIcon className="w-6 h-6" /> Daily Reminders</h3>
                 {notificationPermission !== 'granted' ? (
                     <div className="text-center p-4 bg-gray-900/50 rounded-lg">
                        <p className="text-gray-400 mb-3">Enable notifications to get daily reminders.</p>
                        <button onClick={handleRequestNotifications} className="bg-rose-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-rose-600 transition-colors transform hover:scale-105 active:scale-95">Enable Notifications</button>
                     </div>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 relative">
                            <label htmlFor="am-time" className="font-semibold text-gray-300">☀️ AM:</label>
                            <input type="time" id="am-time" value={amReminder} onChange={handleReminderChange('am')} className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-rose-500"/>
                            {showAmSaveConfirm && <span className="text-sm text-rose-400 ml-2 animate-fade-in">Saved!</span>}
                        </div>
                         <div className="flex items-center gap-3 relative">
                            <label htmlFor="pm-time" className="font-semibold text-gray-300">🌙 PM:</label>
                            <input type="time" id="pm-time" value={pmReminder} onChange={handleReminderChange('pm')} className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-rose-500"/>
                            {showPmSaveConfirm && <span className="text-sm text-rose-400 ml-2 animate-fade-in">Saved!</span>}
                        </div>
                    </div>
                 )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RoutineCard title="☀️ AM Routine" steps={amRoutine} onAdd={amHandlers.add} onDelete={amHandlers.delete} onUpdate={amHandlers.update} onToggleEdit={amHandlers.toggleEdit} />
                <RoutineCard title="🌙 PM Routine" steps={pmRoutine} onAdd={pmHandlers.add} onDelete={pmHandlers.delete} onUpdate={pmHandlers.update} onToggleEdit={pmHandlers.toggleEdit} />
            </div>
        </div>
    );
};