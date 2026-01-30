import './ProgramTabs.css'

function ProgramTabs({ activeTab, onTabChange }) {
  return (
    <div className="program-tabs">
      <button
        className={`tab ${activeTab === 'counseling' ? 'active' : ''}`}
        onClick={() => onTabChange('counseling')}
      >
        College Counseling
      </button>
      <button
        className={`tab ${activeTab === 'research' ? 'active' : ''}`}
        onClick={() => onTabChange('research')}
      >
        Research
      </button>
    </div>
  )
}

export default ProgramTabs
