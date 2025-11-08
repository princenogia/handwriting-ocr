'use client'

import { useState } from 'react'

interface ResultsDisplayProps {
  text: string
}

export default function ResultsDisplay({ text }: ResultsDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (text) {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Extracted Text</h2>
        
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!text}
        >
          {copied ? (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 min-h-[300px] max-h-[500px] overflow-y-auto border border-gray-200 dark:border-gray-700">
        {text ? (
          <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 text-sm leading-relaxed font-mono">
            {text}
          </pre>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <svg
              className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-gray-500 dark:text-gray-400 text-base">
              Your extracted text will appear here
            </p>
          </div>
        )}
      </div>

      {text && (
        <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
          {text.length} characters
        </div>
      )}
    </div>
  )
}
