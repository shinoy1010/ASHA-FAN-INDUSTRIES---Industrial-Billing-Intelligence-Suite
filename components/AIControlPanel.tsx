
import React, { useState } from 'react';
import { analyzeData, transformData } from '../services/geminiService';
import { SpreadsheetState, AnalysisResponse } from '../types';

interface AIControlPanelProps {
  state: SpreadsheetState;
  onUpdateData: (newData: any[], message: string) => void;
}

const AIControlPanel: React.FC<AIControlPanelProps> = ({ state, onUpdateData }) => {
  const [instruction, setInstruction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);

  const handleApplyAI = async () => {
    if (!instruction.trim() || state.data.length === 0) return;
    setIsProcessing(true);
    try {
      const response = await transformData(state, instruction);
      onUpdateData(response.updatedData, response.explanation);
      setInstruction('');
    } catch (error) {
      console.error("AI Error:", error);
      alert("Something went wrong with the AI processing. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAnalyze = async () => {
    if (state.data.length === 0) return;
    setIsProcessing(true);
    try {
      const response = await analyzeData(state);
      setAnalysis(response);
    } catch (error) {
      console.error("Analysis Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-white border border-slate-200 rounded-xl shadow-sm h-full overflow-y-auto">
      <div>
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
          <span className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
          </span>
          AI Assistant
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Transform Instructions</label>
            <textarea
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm h-32 resize-none shadow-sm"
              placeholder="Ex: 'Format timestamps', 'Categorize responses', 'Merge similar names'..."
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              disabled={isProcessing}
            />
          </div>
          
          <button
            onClick={handleApplyAI}
            disabled={isProcessing || !instruction}
            className={`w-full py-2.5 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              isProcessing || !instruction
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100 active:scale-[0.98]'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-current" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Thinking...
              </span>
            ) : 'Apply AI Change'}
          </button>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Data Insights</h4>
          <button 
            onClick={handleAnalyze}
            disabled={isProcessing || state.data.length === 0}
            className="text-xs text-indigo-600 font-bold hover:underline disabled:text-slate-400 flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            {analysis ? 'Refresh' : 'Analyze'}
          </button>
        </div>

        {analysis ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-900 leading-relaxed font-medium">
              "{analysis.summary}"
            </div>
            <ul className="space-y-2.5">
              {analysis.insights.map((insight, idx) => (
                <li key={idx} className="flex gap-3 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-indigo-500 font-bold shrink-0">#{idx + 1}</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
            <p className="text-xs font-medium text-slate-400 px-4">Click analyze to generate high-level insights using Gemini Flash</p>
          </div>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 font-bold text-center uppercase tracking-widest">
          Gemini 3 Intelligence Layer
        </p>
      </div>
    </div>
  );
};

export default AIControlPanel;
