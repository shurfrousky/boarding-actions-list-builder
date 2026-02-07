import { useState } from 'react';
import armyData from './boarding_actions_data.json'; 
import './App.css'; 

export default function App() {
    // Syntax: const [variable, setterFunction] = useState(initialValue);
    const [selectedFactionId, setSelectedFactionId] = useState(""); 
    const [selectedDetachmentId, setSelectedDetachmentId] = useState("");

    // toggle rules popup
    const [showRules, setShowRules] = useState(false);

    // The "Roster" is the list of units user has added
    const [roster, setRoster] = useState([]);

    // finding the full object for the selected faction based on the ID stored in state.
    const currentFaction = armyData.factions.find(f => f.id === selectedFactionId);
    
    // finding the full object for the selected detachment.
    const currentDetachment = currentFaction?.detachments.find(d => d.id === selectedDetachmentId);

    // Calculate total points automatically from the roster
    const currentPoints = roster.reduce((total, unit) => total + unit.points, 0);

    // -- HELPER -- Grouping Units by their Mustering Rules
    const getCategorizedUnits = () => {
        if (!currentDetachment) return [];

        // Filter out rules that don't have 'allowed_units'
        const displayableRules = currentDetachment.mustering_rules.filter(rule => rule.allowed_units);

        return displayableRules.map(rule => {
            // 1. Calculate the TOTAL count for this category (for Leader limits)
            const categoryTotalCount = roster.filter(r => 
                rule.allowed_units.includes(r.id)
            ).length;

            // 2. Get the units and calculate "disabled" for EACH one
            const unitsInThisRule = currentFaction.units
                .filter(u => rule.allowed_units.includes(u.id))
                .map(u => {
                    // How many of THIS specific unit do we have?
                    const specificUnitCount = roster.filter(r => r.id === u.id).length;
                    
                    let isDisabled = false;

                    // LOGIC A: "Select up to X Total" (Leaders)
                    if (rule.type === 'select_up_to_x') {
                        if (categoryTotalCount >= rule.limit) isDisabled = true;
                    }

                    // LOGIC B: "Select up to X Each" (Troops/Elites)
                    if (rule.type === 'select_up_to_x_each') {
                        if (specificUnitCount >= rule.limit_per_unit) isDisabled = true;
                    }

                    return { ...u, isDisabled, specificUnitCount };
                });

            return {
                categoryName: rule.category_name,
                units: unitsInThisRule,
                headerLimit: rule.type === 'select_up_to_x' ? `${categoryTotalCount} / ${rule.limit}` : null,
                ruleType: rule.type
            };
        });
    };

    const categorizedUnits = getCategorizedUnits();

    // -- EVENT HANDLERS --
    const handleFactionChange = (e) => {
        setSelectedFactionId(e.target.value);
        setSelectedDetachmentId(""); 
        setRoster([]); 
    };

    const handleDetachmentChange = (e) => {
        setSelectedDetachmentId(e.target.value);
        setRoster([]); 
    };

    const addToRoster = (unit) => {
        if (currentPoints + unit.points > 500) {
            alert("Cannot add unit: Exceeds 500 points limit!");
            return;
        }

        const newEntry = {
            ...unit, 
            unique_id: Date.now() + Math.random() 
        };

        setRoster([...roster, newEntry]);
    };

    const removeFromRoster = (uniqueIdToRemove) => {
        setRoster(roster.filter(unit => unit.unique_id !== uniqueIdToRemove));
    };

    // -- RENDER --
    return (
        <div className="app-container" style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
        
            {/* HEADER */}
            <header style={{ borderBottom: '2px solid #333', marginBottom: '20px', paddingBottom: '10px' }}>
                <h1>Boarding Actions List Builder</h1>
                <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: currentPoints > 500 ? 'red' : 'green' }}>
                Points: {currentPoints} / 500
                </div>
            </header>

            {/* SELECTORS */}
            <section className="selectors" style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'flex-end' }}>
                <div>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>Faction</label>
                    <select 
                        value={selectedFactionId} 
                        onChange={handleFactionChange}
                        style={{ padding: '8px', width: '200px' }}
                    >
                        <option value="">-- Choose Faction --</option>
                        {armyData.factions.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                    </select>
                </div>

                {currentFaction && (
                <div>
                    <label style={{ display: 'block', fontWeight: 'bold' }}>Detachment</label>
                    <select 
                        value={selectedDetachmentId} 
                        onChange={handleDetachmentChange}
                        style={{ padding: '8px', width: '250px' }}
                    >
                        <option value="">-- Choose Detachment --</option>
                        {currentFaction.detachments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                </div>
                )}

                {/* View Rules Button */}
                {currentDetachment && (
                    <button 
                        onClick={() => setShowRules(true)}
                        style={{ padding: '8px 16px', background: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', height: '36px'}}
                    >
                        📖 View Rules
                    </button>
                )}
            </section>

            {/* The Rules Modal Overlay */}
            {showRules && currentDetachment && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.57)', zIndex: 1000,
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{
                        background: 'rgb(44, 140, 230)', padding: '20px', borderRadius: '8px',
                        width: '90%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto',
                        position: 'relative'
                    }}>
                        <button 
                            onClick={() => setShowRules(false)}
                            style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '1.5em', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            ✖
                        </button>
                        
                        <h2 style={{ borderBottom: '2px solid #2b076d', paddingBottom: '10px' }}>{currentDetachment.name} Reference</h2>
                        
                        {/* Detachment Rule */}
                        <div style={{ marginBottom: '20px', background: '#2b076d', padding: '10px', borderRadius: '5px' }}>
                            <h3 style={{ marginTop: 0 }}>Detachment Rule: {currentDetachment.detachment_rule.name}</h3>
                            <p>{currentDetachment.detachment_rule.description}</p>
                        </div>

                        {/* Enhancements */}
                        <div style={{ marginBottom: '20px', background: '#2b076d' }}>
                            <h3>Enhancements</h3>
                            {currentDetachment.enhancements.map((enh, idx) => (
                                <div key={idx} style={{ marginBottom: '10px', paddingLeft: '10px' }}>
                                    <strong>{enh.name}:</strong> {enh.description}
                                </div>
                            ))}
                        </div>

                        {/* Stratagems */}
                        <div style={{background: '#2b076d'}}>
                            <h3>Stratagems</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                {currentDetachment.stratagems.map((strat, idx) => (
                                    <div key={idx} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '5px' }}>
                                            <span>{strat.name}</span>
                                            <span style={{ background: '#333', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize: '0.8em' }}>{strat.cost}CP</span>
                                        </div>
                                        <div style={{ fontSize: '0.9em' }}>{strat.description}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            )}

            {/* MAIN CONTENT COLUMNS */}
            {currentDetachment && (
                <div className="builder-columns" style={{ display: 'flex', gap: '40px' }}>
                
                    {/* LEFT COLUMN: AVAILABLE UNITS */}
                    <div style={{ flex: 1 }}>
                        <h3 style={{ borderBottom: '1px solid #ccc' }}>Available Units</h3>
                        
                        {categorizedUnits.map((category, index) => (
                            <div key={index} style={{ marginBottom: '20px' }}>
                                {/* Category Header */}
                                <h4 style={{ 
                                    background: '#444', 
                                    color: 'white', 
                                    padding: '5px 10px', 
                                    margin: '0 0 10px 0',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <span>{category.categoryName}</span>
                                    {category.headerLimit && (
                                        <span>{category.headerLimit}</span>
                                    )}
                                </h4>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {category.units.map(unit => (
                                        <div key={unit.id} style={{ 
                                            border: '1px solid #ccc', 
                                            padding: '10px', 
                                            borderRadius: '5px', 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            opacity: unit.isDisabled ? 0.5 : 1,
                                            background: unit.isDisabled ? '#f0f0f0' : 'transparent'
                                        }}>
                                            <div>
                                                <strong>{unit.name}</strong>
                                                <div style={{ fontSize: '0.8em', color: '#666' }}>
                                                    {unit.keywords.join(", ")}
                                                </div>
                                                {category.ruleType === 'select_up_to_x_each' && unit.specificUnitCount > 0 && (
                                                    <div style={{ fontSize: '0.8em', color: 'blue', fontWeight: 'bold' }}>
                                                        Count: {unit.specificUnitCount}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{unit.points} pts</div>
                                                <button 
                                                    onClick={() => addToRoster(unit)}
                                                    disabled={unit.isDisabled} 
                                                    style={{ 
                                                        background: unit.isDisabled ? '#ccc' : '#007bff', 
                                                        color: 'white', 
                                                        border: 'none', 
                                                        padding: '5px 10px', 
                                                        borderRadius: '3px', 
                                                        cursor: unit.isDisabled ? 'not-allowed' : 'pointer' 
                                                    }}
                                                >
                                                    Add +
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div> 

                    {/* RIGHT COLUMN: MY ROSTER */}
                    <div style={{ flex: 1, background: '#666666ff', padding: '15px', borderRadius: '8px', border: '1px solid #9e9e9eff' }}>
                        <h3 style={{ borderBottom: '1px solid #c0c0c0ff', marginTop: 0 }}>My Mustered Force</h3>
                        
                        {roster.length === 0 ? (
                            <p style={{ fontStyle: 'italic', color: '#e9d631ff' }}>Your list is empty. Add units from the left.</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {roster.map(entry => (
                                    <div key={entry.unique_id} style={{ background: 'black', border: '1px solid #999', padding: '10px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong>{entry.name}</strong>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span>{entry.points} pts</span>
                                            <button 
                                                onClick={() => removeFromRoster(entry.unique_id)}
                                                style={{ background: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                
                                <div style={{ marginTop: '20px', paddingTop: '10px', borderTop: '2px solid #333', textAlign: 'right', fontWeight: 'bold', fontSize: '1.2em' }}>
                                    Total: {currentPoints} pts
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            )}
        </div>
    );
}