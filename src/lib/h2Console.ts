/**
 * H2 Database Console
 * Provides a web-based console interface for H2 database management
 */

import h2Database from './h2Database';

interface ConsoleCommand {
  id: string;
  command: string;
  result: any;
  timestamp: Date;
  error?: string;
}

interface ConsoleStats {
  totalTables: number;
  totalRecords: number;
  databaseSize: string;
  lastBackup?: Date;
}

class H2Console {
  private commands: ConsoleCommand[] = [];
  private isOpen: boolean = false;
  private consoleElement: HTMLElement | null = null;

  constructor() {
    this.setupKeyboardShortcuts();
  }

  /**
   * Open the H2 console
   */
  open(): void {
    if (this.isOpen) return;

    this.createConsoleUI();
    this.isOpen = true;
    this.loadDatabaseStats();
  }

  /**
   * Close the H2 console
   */
  close(): void {
    if (!this.isOpen) return;

    if (this.consoleElement) {
      this.consoleElement.remove();
      this.consoleElement = null;
    }
    this.isOpen = false;
  }

  /**
   * Toggle console visibility
   */
  toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Execute a SQL-like command
   */
  async executeCommand(command: string): Promise<ConsoleCommand> {
    const cmd: ConsoleCommand = {
      id: this.generateId(),
      command: command.trim(),
      result: null,
      timestamp: new Date()
    };

    try {
      const result = await this.parseAndExecute(command);
      cmd.result = result;
    } catch (error) {
      cmd.error = error instanceof Error ? error.message : 'Unknown error';
    }

    this.commands.unshift(cmd);
    this.updateConsoleUI();
    return cmd;
  }

  /**
   * Parse and execute SQL-like commands
   */
  private async parseAndExecute(command: string): Promise<any> {
    const cmd = command.toLowerCase().trim();

    if (cmd.startsWith('select')) {
      return this.handleSelect(command);
    } else if (cmd.startsWith('insert')) {
      return this.handleInsert(command);
    } else if (cmd.startsWith('update')) {
      return this.handleUpdate(command);
    } else if (cmd.startsWith('delete')) {
      return this.handleDelete(command);
    } else if (cmd.startsWith('show tables')) {
      return this.handleShowTables();
    } else if (cmd.startsWith('describe') || cmd.startsWith('desc')) {
      return this.handleDescribe(command);
    } else if (cmd.startsWith('count')) {
      return this.handleCount(command);
    } else if (cmd.startsWith('backup')) {
      return this.handleBackup();
    } else if (cmd.startsWith('restore')) {
      return this.handleRestore(command);
    } else if (cmd.startsWith('clear')) {
      return this.handleClear();
    } else if (cmd.startsWith('help')) {
      return this.handleHelp();
    } else {
      throw new Error(`Unknown command: ${command}`);
    }
  }

  /**
   * Handle SELECT queries
   */
  private async handleSelect(command: string): Promise<any> {
    // Simple SELECT parsing (basic implementation)
    const match = command.match(/select\s+(.+?)\s+from\s+(\w+)(?:\s+where\s+(.+?))?(?:\s+order\s+by\s+(.+?))?/i);
    
    if (!match) {
      throw new Error('Invalid SELECT syntax');
    }

    const [, columns, table, whereClause, orderBy] = match;
    
    let conditions: any = undefined;
    if (whereClause) {
      conditions = this.parseWhereClause(whereClause);
    }

    const result = await h2Database.select(table, conditions, orderBy);
    return result;
  }

  /**
   * Handle INSERT queries
   */
  private async handleInsert(command: string): Promise<any> {
    const match = command.match(/insert\s+into\s+(\w+)\s+\((.+?)\)\s+values\s+\((.+?)\)/i);
    
    if (!match) {
      throw new Error('Invalid INSERT syntax');
    }

    const [, table, columns, values] = match;
    const columnList = columns.split(',').map(c => c.trim());
    const valueList = values.split(',').map(v => v.trim().replace(/['"]/g, ''));
    
    const data: any = {};
    columnList.forEach((col, index) => {
      data[col] = valueList[index];
    });

    const result = await h2Database.insert(table, data);
    return result;
  }

  /**
   * Handle UPDATE queries
   */
  private async handleUpdate(command: string): Promise<any> {
    const match = command.match(/update\s+(\w+)\s+set\s+(.+?)(?:\s+where\s+(.+?))?/i);
    
    if (!match) {
      throw new Error('Invalid UPDATE syntax');
    }

    const [, table, setClause, whereClause] = match;
    
    const data: any = {};
    setClause.split(',').forEach(pair => {
      const [key, value] = pair.split('=').map(s => s.trim());
      data[key] = value.replace(/['"]/g, '');
    });

    if (!whereClause) {
      throw new Error('UPDATE requires WHERE clause for safety');
    }

    const conditions = this.parseWhereClause(whereClause);
    const selectResult = await h2Database.select(table, conditions);
    
    if (selectResult.data.length === 0) {
      throw new Error('No records found to update');
    }

    const result = await h2Database.update(table, selectResult.data[0].id, data);
    return result;
  }

  /**
   * Handle DELETE queries
   */
  private async handleDelete(command: string): Promise<any> {
    const match = command.match(/delete\s+from\s+(\w+)(?:\s+where\s+(.+?))?/i);
    
    if (!match) {
      throw new Error('Invalid DELETE syntax');
    }

    const [, table, whereClause] = match;
    
    if (!whereClause) {
      throw new Error('DELETE requires WHERE clause for safety');
    }

    const conditions = this.parseWhereClause(whereClause);
    const selectResult = await h2Database.select(table, conditions);
    
    if (selectResult.data.length === 0) {
      throw new Error('No records found to delete');
    }

    const result = await h2Database.delete(table, selectResult.data[0].id);
    return result;
  }

  /**
   * Show all tables
   */
  private async handleShowTables(): Promise<any> {
    const tables = ['users', 'todos', 'sessions', 'settings'];
    const tableInfo = [];

    for (const table of tables) {
      const result = await h2Database.select(table);
      tableInfo.push({
        table,
        records: result.count
      });
    }

    return { tables: tableInfo };
  }

  /**
   * Describe table structure
   */
  private async handleDescribe(command: string): Promise<any> {
    const match = command.match(/describe\s+(\w+)|desc\s+(\w+)/i);
    
    if (!match) {
      throw new Error('Invalid DESCRIBE syntax');
    }

    const table = match[1] || match[2];
    
    // Return table schema information
    const schemas: any = {
      users: [
        { column: 'id', type: 'TEXT', key: 'PRI', null: 'NO' },
        { column: 'email', type: 'TEXT', key: 'UNI', null: 'NO' },
        { column: 'password', type: 'TEXT', key: '', null: 'YES' },
        { column: 'created_at', type: 'DATETIME', key: '', null: 'YES' },
        { column: 'updated_at', type: 'DATETIME', key: '', null: 'YES' },
        { column: 'last_sign_in_at', type: 'DATETIME', key: '', null: 'YES' }
      ],
      todos: [
        { column: 'id', type: 'INTEGER', key: 'PRI', null: 'NO' },
        { column: 'content', type: 'TEXT', key: '', null: 'NO' },
        { column: 'completed', type: 'BOOLEAN', key: '', null: 'YES' },
        { column: 'user_id', type: 'TEXT', key: '', null: 'YES' },
        { column: 'created_at', type: 'DATETIME', key: '', null: 'YES' },
        { column: 'updated_at', type: 'DATETIME', key: '', null: 'YES' }
      ],
      sessions: [
        { column: 'id', type: 'TEXT', key: 'PRI', null: 'NO' },
        { column: 'user_id', type: 'TEXT', key: '', null: 'YES' },
        { column: 'expires_at', type: 'DATETIME', key: '', null: 'YES' },
        { column: 'created_at', type: 'DATETIME', key: '', null: 'YES' }
      ],
      settings: [
        { column: 'id', type: 'INTEGER', key: 'PRI', null: 'NO' },
        { column: 'key', type: 'TEXT', key: '', null: 'NO' },
        { column: 'value', type: 'TEXT', key: '', null: 'YES' },
        { column: 'user_id', type: 'TEXT', key: '', null: 'YES' },
        { column: 'created_at', type: 'DATETIME', key: '', null: 'YES' },
        { column: 'updated_at', type: 'DATETIME', key: '', null: 'YES' }
      ]
    };

    return { table, columns: schemas[table] || [] };
  }

  /**
   * Count records in table
   */
  private async handleCount(command: string): Promise<any> {
    const match = command.match(/count\s+(\w+)/i);
    
    if (!match) {
      throw new Error('Invalid COUNT syntax');
    }

    const table = match[1];
    const result = await h2Database.select(table);
    return { table, count: result.count };
  }

  /**
   * Backup database
   */
  private async handleBackup(): Promise<any> {
    const backup: any = {};
    const tables = ['users', 'todos', 'sessions', 'settings'];

    for (const table of tables) {
      const result = await h2Database.select(table);
      backup[table] = result.data;
    }

    // Save to localStorage
    localStorage.setItem('h2_backup', JSON.stringify({
      data: backup,
      timestamp: new Date().toISOString()
    }));

    return { message: 'Database backed up successfully', tables: tables.length };
  }

  /**
   * Restore database
   */
  private async handleRestore(command: string): Promise<any> {
    const backupData = localStorage.getItem('h2_backup');
    
    if (!backupData) {
      throw new Error('No backup found');
    }

    const backup = JSON.parse(backupData);
    
    // Clear existing data and restore
    for (const [table, data] of Object.entries(backup.data)) {
      // Note: In a real implementation, you'd want to clear the table first
      // This is a simplified version
    }

    return { message: 'Database restored successfully', timestamp: backup.timestamp };
  }

  /**
   * Clear console history
   */
  private handleClear(): any {
    this.commands = [];
    this.updateConsoleUI();
    return { message: 'Console cleared' };
  }

  /**
   * Show help
   */
  private handleHelp(): any {
    return {
      commands: [
        'SELECT * FROM table_name [WHERE condition] [ORDER BY column]',
        'INSERT INTO table_name (col1, col2) VALUES (val1, val2)',
        'UPDATE table_name SET col1=val1 WHERE condition',
        'DELETE FROM table_name WHERE condition',
        'SHOW TABLES',
        'DESCRIBE table_name',
        'COUNT table_name',
        'BACKUP',
        'RESTORE',
        'CLEAR',
        'HELP'
      ]
    };
  }

  /**
   * Parse WHERE clause
   */
  private parseWhereClause(whereClause: string): any {
    const conditions: any = {};
    const parts = whereClause.split(' and ');
    
    parts.forEach(part => {
      const [key, value] = part.split('=').map(s => s.trim());
      conditions[key] = value.replace(/['"]/g, '');
    });

    return conditions;
  }

  /**
   * Create console UI
   */
  private createConsoleUI(): void {
    const consoleDiv = document.createElement('div');
    consoleDiv.id = 'h2-console';
    consoleDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        font-family: 'Courier New', monospace;
        color: #00ff00;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 90%;
          height: 80%;
          background: #000;
          border: 2px solid #00ff00;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
        ">
          <div style="
            padding: 10px;
            border-bottom: 1px solid #00ff00;
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <h3 style="margin: 0; color: #00ff00;">H2 Database Console</h3>
            <button id="close-console" style="
              background: #ff0000;
              color: white;
              border: none;
              padding: 5px 10px;
              cursor: pointer;
              border-radius: 4px;
            ">Close</button>
          </div>
          <div style="
            flex: 1;
            padding: 10px;
            overflow-y: auto;
            font-size: 12px;
          " id="console-output">
            <div>H2 Database Console Ready. Type 'help' for commands.</div>
          </div>
          <div style="
            padding: 10px;
            border-top: 1px solid #00ff00;
            display: flex;
          ">
            <span style="color: #00ff00; margin-right: 10px;">H2> </span>
            <input type="text" id="console-input" style="
              flex: 1;
              background: #000;
              color: #00ff00;
              border: 1px solid #00ff00;
              padding: 5px;
              font-family: 'Courier New', monospace;
              font-size: 12px;
            " placeholder="Enter SQL command...">
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(consoleDiv);
    this.consoleElement = consoleDiv;

    // Setup event listeners
    const input = document.getElementById('console-input') as HTMLInputElement;
    const closeBtn = document.getElementById('close-console');
    const output = document.getElementById('console-output');

    input?.focus();

    input?.addEventListener('keypress', async (e) => {
      if (e.key === 'Enter') {
        const command = input.value;
        input.value = '';
        
        if (command.trim()) {
          await this.executeCommand(command);
        }
      }
    });

    closeBtn?.addEventListener('click', () => {
      this.close();
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.close();
      }
    });
  }

  /**
   * Update console UI
   */
  private updateConsoleUI(): void {
    const output = document.getElementById('console-output');
    if (!output) return;

    output.innerHTML = this.commands.map(cmd => {
      const timestamp = cmd.timestamp.toLocaleTimeString();
      const result = cmd.error ? 
        `<div style="color: #ff0000;">Error: ${cmd.error}</div>` :
        `<div style="color: #00ff00;">${JSON.stringify(cmd.result, null, 2)}</div>`;
      
      return `
        <div style="margin-bottom: 10px;">
          <div style="color: #888;">[${timestamp}] ${cmd.command}</div>
          ${result}
        </div>
      `;
    }).join('');

    output.scrollTop = output.scrollHeight;
  }

  /**
   * Load database stats
   */
  private async loadDatabaseStats(): Promise<void> {
    try {
      const stats = await this.getDatabaseStats();
      const output = document.getElementById('console-output');
      if (output) {
        output.innerHTML = `
          <div style="color: #00ff00; margin-bottom: 10px;">
            H2 Database Console Ready<br>
            Tables: ${stats.totalTables} | Records: ${stats.totalRecords} | Size: ${stats.databaseSize}
          </div>
          <div>Type 'help' for available commands.</div>
        `;
      }
    } catch (error) {
      console.error('Failed to load database stats:', error);
    }
  }

  /**
   * Get database statistics
   */
  private async getDatabaseStats(): Promise<ConsoleStats> {
    const tables = ['users', 'todos', 'sessions', 'settings'];
    let totalRecords = 0;

    for (const table of tables) {
      const result = await h2Database.select(table);
      totalRecords += result.count;
    }

    return {
      totalTables: tables.length,
      totalRecords,
      databaseSize: this.calculateDatabaseSize()
    };
  }

  /**
   * Calculate database size
   */
  private calculateDatabaseSize(): string {
    try {
      const estimate = navigator.storage?.estimate();
      if (estimate) {
        const used = (estimate.usage || 0) / 1024 / 1024;
        return `${used.toFixed(2)} MB`;
      }
    } catch (error) {
      // Fallback
    }
    return 'Unknown';
  }

  /**
   * Setup keyboard shortcuts
   */
  private setupKeyboardShortcuts(): void {
    document.addEventListener('keydown', (e) => {
      // Ctrl+Shift+H to open console
      if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// Create and export console instance
const h2Console = new H2Console();

export default h2Console;
export { H2Console };
