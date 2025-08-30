import React, { useEffect, useState } from 'react';

const EventTypeEditor = ({ refresh, refreshHelper }) => {
	const [eventTypes, setEventTypes] = useState([]);
	const [loading, setLoading] = useState(true);
	const [newEventType, setNewEventType] = useState({
		name: '',
		color: '#2196f3',
	});
	const [editingEventType, setEditingEventType] = useState(null);

	useEffect(() => {
		const fetchEventTypes = async () => {
			setLoading(true);
			try {
				const res = await fetch('/api/schedule/eventTypes');
				const data = await res.json();
				setEventTypes(data);
			} catch {
				setEventTypes([]);
			} finally {
				setLoading(false);
			}
		};
		fetchEventTypes();
	}, []);

	const handleCreate = async () => {
		try {
			const res = await fetch('/api/schedule/eventTypes', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(newEventType)
			});
			const result = await res.json();
			setEventTypes([...eventTypes, { ...newEventType, _id: result._id }]);
			setNewEventType({ name: '', color: '#2196f3' });
			refresh();
		} catch (err) {
			// handle error
		}
	};

	const handleUpdate = async () => {
		if (!editingEventType) return;
		try {
			await fetch('/api/schedule/eventTypes', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...editingEventType, id: editingEventType._id })
			});
			setEventTypes(eventTypes.map(et => et._id === editingEventType._id ? editingEventType : et));
			setEditingEventType(null);
            refresh();
		} catch (err) {
			// handle error
		}
	};

	const handleDelete = async (id) => {
		try {
			await fetch('/api/schedule/eventTypes', {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id })
			});
			setEventTypes(eventTypes.filter(et => et._id !== id));
			if (editingEventType && editingEventType._id === id) setEditingEventType(null);
			refresh();
		} catch (err) {
			// handle error
		}
	};

	return (
		<div className="event-type-editor p-6 bg-gray-50 rounded-lg shadow-md max-w-xl w-1/2 mx-auto">

			<div className={`event-type-form p-6 rounded-lg shadow-lg ${editingEventType ? 'bg-purple-50 border border-purple-400' : 'bg-green-50 border border-green-400'}`}>
				<h3 className={`text-xl font-bold mb-4 ${editingEventType ? 'text-purple-700' : 'text-green-700'}`}>{editingEventType ? 'Edit Event Type' : 'Create New Event Type'}</h3>
				<div className="mb-3">
					<label className="block font-medium mb-1">
						Name:
						<input
							type="text"
							className="w-full p-2 border rounded"
							value={editingEventType ? editingEventType.name : newEventType.name}
							onChange={e => {
								if (editingEventType) {
                                    setEditingEventType({ ...editingEventType, name: e.target.value });
								} else {
                                    setNewEventType({ ...newEventType, name: e.target.value });
								}
							}}
						/>
					</label>
				</div>
				<div className="mb-3">
					<label className="block font-medium mb-1">
						Color (Avoid Blue or Gray):
						<input
							type="color"
							className="ml-2 w-12 h-8 p-0 border rounded"
							value={editingEventType ? editingEventType.color : newEventType.color}
							onChange={e => {
                                if (editingEventType) {
                                    setEditingEventType({ ...editingEventType, color: e.target.value });
								} else {
                                    setNewEventType({ ...newEventType, color: e.target.value });
								}
							}}
						/>
					</label>
				</div>
				{editingEventType ? (
                    <div className="flex gap-2 mt-4">
						<button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700" onClick={handleUpdate}>Save Changes</button>
						<button className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400" onClick={() => setEditingEventType(null)}>Cancel</button>
					</div>
				) : (
                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={handleCreate}>Create Event Type</button>
				)}
			</div>
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Event Types</h2>
            {loading ? (
                <p className="text-gray-500">Loading event types...</p>
            ) : eventTypes.length > 0 ? (
                <div className="grid gap-4 mb-6">
                    {eventTypes.map(et => (
                        <div key={et._id} className="flex items-center justify-between p-4 rounded-md shadow-sm border-l-4" style={{ borderColor: et.color || '#2196f3', background: '#fff' }}>
                            <div className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full border" style={{ background: et.color || '#2196f3' }}></span>
                                <span className="font-semibold text-gray-800">{et.name}</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200" onClick={() => setEditingEventType(et)}>Edit</button>
                                <button className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200" onClick={() => handleDelete(et._id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No event types found.</p>
            )}
		</div>
	);
};

export default EventTypeEditor;
