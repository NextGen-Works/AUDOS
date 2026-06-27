import { useState, useEffect } from 'react'
import { useJournal } from '../store/journalStore'

interface JournalEntry {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  mood?: 'calm' | 'focused' | 'creative' | 'unknown'
}

const moodOptions: { value: JournalEntry['mood']; label: string; icon: string }[] = [
  { value: 'calm', label: 'Calm', icon: '😌' },
  { value: 'focused', label: 'Focused', icon: '🎯' },
  { value: 'creative', label: 'Creative', icon: '✨' },
  { value: 'unknown', label: 'Unknown', icon: '❓' },
]

export function Journal() {
  const { entries, selectedEntry, addEntry, updateEntry, deleteEntry, setSelectedEntry } = useJournal()

  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newTags, setNewTags] = useState('')
  const [newMood, setNewMood] = useState<JournalEntry['mood']>('unknown')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterMood, setFilterMood] = useState<JournalEntry['mood'] | 'all'>('all')

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMood = filterMood === 'all' || entry.mood === filterMood
    return matchesSearch && matchesMood
  })

  const handleAddEntry = () => {
    if (!newTitle.trim() || !newContent.trim()) return

    const entry: JournalEntry = {
      id: Date.now().toString(),
      title: newTitle,
      content: newContent,
      tags: newTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date(),
      updatedAt: new Date(),
      mood: newMood,
    }

    addEntry(entry)
    setNewTitle('')
    setNewContent('')
    setNewTags('')
    setNewMood('unknown')
    setIsAdding(false)
  }

  const handleUpdateEntry = () => {
    if (!selectedEntry) return

    const updatedEntry: JournalEntry = {
      ...selectedEntry,
      title: newTitle || selectedEntry.title,
      content: newContent || selectedEntry.content,
      tags: newTags ? newTags.split(',').map(tag => tag.trim()).filter(tag => tag) : selectedEntry.tags,
      mood: newMood || selectedEntry.mood,
      updatedAt: new Date(),
    }

    updateEntry(updatedEntry)
    setIsEditing(false)
  }

  const handleDeleteEntry = (id: string) => {
    deleteEntry(id)
  }

  const handleSelectEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry)
    setNewTitle(entry.title)
    setNewContent(entry.content)
    setNewTags(entry.tags.join(', '))
    setNewMood(entry.mood || 'unknown')
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsAdding(false)
    setIsEditing(false)
    setNewTitle('')
    setNewContent('')
    setNewTags('')
    setNewMood('unknown')
    setSelectedEntry(null)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getMoodIcon = (mood: JournalEntry['mood'] | undefined) => {
    const option = moodOptions.find(opt => opt.value === mood)
    return option ? option.icon : moodOptions[3].icon
  }

  return (
    <div className="journal-container">
      <div className="journal-header">
        <h2>Keepers Companion</h2>
        <div className="journal-stats">
          <span>{entries.length} entries</span>
        </div>
      </div>

      <div className="journal-content">
        <div className="journal-sidebar">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search entries..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <select
              value={filterMood}
              onChange={e => setFilterMood(e.target.value as JournalEntry['mood'] | 'all')}
              className="filter-select"
            >
              <option value="all">All Moods</option>
              {moodOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="entries-list">
            {filteredEntries.length === 0 ? (
              <div className="empty-state">No entries found</div>
            ) : (
              filteredEntries.map(entry => (
                <div
                  key={entry.id}
                  className={`entry-item ${selectedEntry?.id === entry.id ? 'selected' : ''}`}
                  onClick={() => handleSelectEntry(entry)}
                >
                  <div className="entry-header">
                    <h3 className="entry-title">{entry.title}</h3>
                    <span className="entry-mood">{getMoodIcon(entry.mood)}</span>
                  </div>
                  <div className="entry-preview">
                    {entry.content.substring(0, 60)}...
                  </div>
                  <div className="entry-meta">
                    <span className="entry-date">{formatDate(entry.createdAt)}</span>
                    {entry.tags.length > 0 && (
                      <div className="entry-tags">
                        {entry.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="tag">#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      handleDeleteEntry(entry.id)
                    }}
                    className="delete-button"
                    title="Delete entry"
                  >
                    🗑
                  </button>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="add-entry-button"
          >
            + New Entry
          </button>
        </div>

        <div className="journal-main">
          {isAdding || isEditing ? (
            <div className="entry-editor">
              <div className="editor-header">
                <h3>{isEditing ? 'Edit Entry' : 'New Entry'}</h3>
                <div className="editor-actions">
                  <button onClick={handleCancel} className="cancel-button">
                    Cancel
                  </button>
                  <button
                    onClick={isEditing ? handleUpdateEntry : handleAddEntry}
                    className="save-button"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="editor-form">
                <input
                  type="text"
                  placeholder="Title"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="editor-title"
                />

                <textarea
                  placeholder="Content"
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  className="editor-content"
                />

                <div className="editor-meta">
                  <div className="editor-tags">
                    <label>Tags (comma separated)</label>
                    <input
                      type="text"
                      placeholder="tags"
                      value={newTags}
                      onChange={e => setNewTags(e.target.value)}
                    />
                  </div>

                  <div className="editor-mood">
                    <label>Mood</label>
                    <select
                      value={newMood}
                      onChange={e => setNewMood(e.target.value as JournalEntry['mood'])}
                    >
                      {moodOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.icon} {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : selectedEntry ? (
            <div className="entry-viewer">
              <div className="entry-viewer-header">
                <h3>{selectedEntry.title}</h3>
                <div className="entry-viewer-meta">
                  <span>Created: {formatDate(selectedEntry.createdAt)}</span>
                  <span>Updated: {formatDate(selectedEntry.updatedAt)}</span>
                  <span>{getMoodIcon(selectedEntry.mood)}</span>
                </div>
              </div>

              <div className="entry-viewer-content">
                <pre>{selectedEntry.content}</pre>
              </div>

              {selectedEntry.tags.length > 0 && (
                <div className="entry-viewer-tags">
                  {selectedEntry.tags.map(tag => (
                    <span key={tag} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="empty-editor">
              <h3>Select an entry or create a new one</h3>
              <p>Your journal entries will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
