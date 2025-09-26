/**
 * Example component demonstrating H2 Database usage
 * Shows how to use the H2 database with React hooks
 */

import React, { useState } from 'react';
import { useH2Auth, useTodos, useSettings } from '../hooks/useH2Database';

export function H2Example() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [todoContent, setTodoContent] = useState('');
  const [settingKey, setSettingKey] = useState('');
  const [settingValue, setSettingValue] = useState('');

  const { 
    user, 
    loading: authLoading, 
    error: authError, 
    signUp, 
    signIn, 
    signOut, 
    isAuthenticated 
  } = useH2Auth();

  const { 
    todos, 
    loading: todosLoading, 
    error: todosError, 
    addTodo, 
    toggleTodo, 
    deleteTodo 
  } = useTodos();

  const { 
    settings, 
    loading: settingsLoading, 
    error: settingsError, 
    getSetting, 
    setSetting, 
    deleteSetting 
  } = useSettings();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signUp(email, password);
    if (result.error) {
      console.error('Sign up error:', result.error);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn(email, password);
    if (result.error) {
      console.error('Sign in error:', result.error);
    }
  };

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await addTodo(todoContent);
    if (!result.error) {
      setTodoContent('');
    }
  };

  const handleSetSetting = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await setSetting(settingKey, settingValue);
    if (!result.error) {
      setSettingKey('');
      setSettingValue('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">H2 Database Auth</h2>
        
        <div className="space-y-4">
          <form onSubmit={handleSignUp} className="space-y-4">
            <h3 className="text-lg font-semibold">Sign Up</h3>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {authLoading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>

          <form onSubmit={handleSignIn} className="space-y-4">
            <h3 className="text-lg font-semibold">Sign In</h3>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {authLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {authError && (
            <div className="text-red-500 text-sm">{authError}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">H2 Database Demo</h2>
          <button
            onClick={signOut}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Sign Out
          </button>
        </div>
        
        <div className="text-sm text-gray-600 mb-4">
          Welcome, {user?.email}!
        </div>
      </div>

      {/* Todos Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Todos</h3>
        
        <form onSubmit={handleAddTodo} className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Add a todo..."
              value={todoContent}
              onChange={(e) => setTodoContent(e.target.value)}
              className="flex-1 p-2 border rounded"
              required
            />
            <button
              type="submit"
              disabled={todosLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </form>

        {todosError && (
          <div className="text-red-500 text-sm mb-4">{todosError}</div>
        )}

        <div className="space-y-2">
          {todosLoading ? (
            <div className="text-gray-500">Loading todos...</div>
          ) : todos.length === 0 ? (
            <div className="text-gray-500">No todos yet</div>
          ) : (
            todos.map((todo: any) => (
              <div key={todo.id} className="flex items-center space-x-2 p-2 border rounded">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={(e) => toggleTodo(todo.id, e.target.checked)}
                  className="mr-2"
                />
                <span className={todo.completed ? 'line-through text-gray-500' : ''}>
                  {todo.content}
                </span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Settings Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Settings</h3>
        
        <form onSubmit={handleSetSetting} className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Setting key"
              value={settingKey}
              onChange={(e) => setSettingKey(e.target.value)}
              className="flex-1 p-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Setting value"
              value={settingValue}
              onChange={(e) => setSettingValue(e.target.value)}
              className="flex-1 p-2 border rounded"
              required
            />
            <button
              type="submit"
              disabled={settingsLoading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              Set
            </button>
          </div>
        </form>

        {settingsError && (
          <div className="text-red-500 text-sm mb-4">{settingsError}</div>
        )}

        <div className="space-y-2">
          {settingsLoading ? (
            <div className="text-gray-500">Loading settings...</div>
          ) : settings.length === 0 ? (
            <div className="text-gray-500">No settings yet</div>
          ) : (
            settings.map((setting: any) => (
              <div key={setting.id} className="flex items-center justify-between p-2 border rounded">
                <span className="font-mono text-sm">
                  {setting.key}: {setting.value}
                </span>
                <button
                  onClick={() => deleteSetting(setting.key)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        {/* Example of getting a specific setting */}
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <h4 className="font-semibold mb-2">Get Setting Example:</h4>
          <p className="text-sm">
            Theme: {getSetting('theme') || 'Not set'}
          </p>
        </div>
      </div>

      {/* Database Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Database Info</h3>
        <div className="text-sm space-y-1">
          <p><strong>Database:</strong> H2 (IndexedDB)</p>
          <p><strong>User ID:</strong> {user?.id}</p>
          <p><strong>Total Todos:</strong> {todos.length}</p>
          <p><strong>Total Settings:</strong> {settings.length}</p>
          <p><strong>Created:</strong> {user?.created_at}</p>
        </div>
      </div>
    </div>
  );
}

export default H2Example;
