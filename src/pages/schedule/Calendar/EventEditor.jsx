import React from 'react';

// get events from the api regarding what events are that day, incuding those starting ending, or overlapping with the selected date
// if no events, show a message indicating no events are scheduled for the selected date
// also allow for new events to be created at the selected date
// also allow for editing of events


const EventEditor = ({selectedDate, selectedEndDate, setSelectedDate, setSelectedEndDate}) => {
    const [events, setEvents] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [newEvent, setNewEvent] = React.useState({
        title: '',
        description: '',
        startDate: selectedDate,
        endDate: selectedEndDate || selectedDate,
        isOffDay: false,
        specialSchedule: false,
    });
    const [editingEvent, setEditingEvent] = React.useState(null);

    React.useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                let url = '/api/schedule/events2';
                if (selectedDate) {
                    url += `?selectedDate=${selectedDate}`;
                    if (selectedEndDate) {
                        url += `&selectedEndDate=${selectedEndDate}`;
                    }
                }
                const response = await fetch(url);
                if (!response.ok) throw new Error('Failed to fetch events');
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
                setEvents([]);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, [selectedDate, selectedEndDate]);

    // Only update newEvent dates if form is empty (preserve progress)
    React.useEffect(() => {
        setNewEvent(prev => {
            // If any field except dates is filled, preserve progress
            if (prev.title || prev.description || prev.isOffDay || prev.specialSchedule) {
                return {
                    ...prev,
                    startDate: selectedDate,
                    endDate: selectedEndDate || selectedDate
                };
            } else {
                // If form is empty, reset all fields
                return {
                    title: '',
                    description: '',
                    startDate: selectedDate,
                    endDate: selectedEndDate || selectedDate,
                    isOffDay: false,
                    specialSchedule: false,
                };
            }
        });
    }, [selectedDate, selectedEndDate]);

    // Sync editingEvent's dates with selectedDate/selectedEndDate if they change from outside
    React.useEffect(() => {
        if (editingEvent) {
            setEditingEvent(prev => ({
                ...prev,
                startDate: selectedDate,
                endDate: selectedEndDate || selectedDate
            }));
        }
    }, [selectedDate, selectedEndDate]);

    const handleCreateEvent = async () => {
        try {
            // Use events2 API for creating
            const eventToCreate = {
                ...newEvent,
                startDate: newEvent.startDate || selectedDate,
                endDate: newEvent.endDate || selectedEndDate || selectedDate
            };
            const response = await fetch('/api/schedule/events2', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eventToCreate)
            });
            if (!response.ok) throw new Error('Failed to create event');
            const created = await response.json();
            setEvents([...events, { ...eventToCreate, _id: created._id }]);
            setNewEvent({
                title: '',
                startDate: selectedDate,
                endDate: selectedEndDate || selectedDate,
                isOffDay: false,
                specialSchedule: false,
            });
        } catch (error) {
            console.error('Error creating event:', error);
        }
    };

    const handleUpdateEvent = async () => {
        if (!editingEvent) return;
        try {
            // Use events2 API for updating, send _id as id
            const response = await fetch('/api/schedule/events2', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...editingEvent, id: editingEvent._id })
            });
            if (!response.ok) throw new Error('Failed to update event');
            // No updated event returned, so update locally
            setEvents(events.map(event => event._id === editingEvent._id ? editingEvent : event));
            setEditingEvent(null);
        } catch (error) {
            console.error('Error updating event:', error);
        }
    };

    // Delete event handler
    const handleDeleteEvent = async (eventId) => {
        try {
            const response = await fetch('/api/schedule/events2', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: eventId })
            });
            if (!response.ok) throw new Error('Failed to delete event');
            setEvents(events.filter(event => event._id !== eventId));
            // If editing the deleted event, close the form
            if (editingEvent && editingEvent._id === eventId) {
                setEditingEvent(null);
            }
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    // Determine if multi-day event
    const isMultiDay = selectedEndDate && selectedEndDate !== selectedDate;

    // Remove the event being edited from the events list
    const filteredEvents = editingEvent
        ? events.filter(event => event._id !== editingEvent._id)
        : events;

    return (
        <div className="event-editor p-6 bg-gray-50 rounded-lg shadow-md max-w-2xl w-1/2 mx-auto" >
            <h2 className="text-2xl font-bold mb-4 text-blue-700">
                Events for {new Date(selectedDate).toLocaleDateString()}
                {isMultiDay && ` - ${new Date(selectedEndDate).toLocaleDateString()}`}
            </h2>
            {loading ? (
                <p className="text-gray-500">Loading events...</p>
            ) : filteredEvents.length > 0 ? (
                <div className="events-list grid gap-4 mb-6">
                    {filteredEvents.map(event => (
                        <div
                            key={event._id || event.id}
                            className={`event-item border-l-4 p-4 rounded-md shadow-sm cursor-pointer transition-all duration-200 hover:scale-105 ${event.isOffDay ? 'border-red-500 bg-red-50' : event.specialSchedule ? 'border-yellow-500 bg-yellow-50' : 'border-blue-500 bg-white'}`}
                            onClick={() => {
                                setSelectedDate(event.startDate);
                                setSelectedEndDate(event.endDate || event.startDate);
                            }}
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                                <div className="flex gap-2">
                                    <button
                                        className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                                        onClick={e => {
                                            e.stopPropagation();
                                            setEditingEvent({
                                                ...event,
                                                endDate: event.endDate ? event.endDate : event.startDate
                                            });
                                        }}
                                    >Edit</button>
                                    <button
                                        className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
                                        onClick={e => {
                                            e.stopPropagation();
                                            handleDeleteEvent(event._id || event.id);
                                        }}
                                    >Delete</button>
                                </div>
                            </div>
                            {event.description && (
                                <div className="text-sm text-gray-700 mt-2 mb-1">
                                    <span className="font-medium">Description:</span> {event.description}
                                </div>
                            )}
                            <div className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">Start:</span> {new Date(event.startDate).toLocaleString()}<br />
                                <span className="font-medium">End:</span> {new Date(event.endDate).toLocaleString()}
                            </div>
                            <div className="mt-2 flex gap-2">
                                {event.isOffDay && <span className="px-2 py-1 bg-red-200 text-red-800 rounded text-xs">Off Day</span>}
                                {event.specialSchedule && <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded text-xs">Special Schedule</span>}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No events scheduled for this date.</p>
            )}

            <div className={`event-form p-6 rounded-lg shadow-lg ${editingEvent ? 'bg-purple-50 border border-purple-400' : 'bg-green-50 border border-green-400'}`}>
                <h3 className={`text-xl font-bold mb-4 ${editingEvent ? 'text-purple-700' : 'text-green-700'}`}>{editingEvent ? 'Edit Event' : 'Create New Event'}</h3>
                <div className="mb-3">
                    <label className="block font-medium mb-1">
                        Title:
                        <input 
                            type="text" 
                            className="w-full p-2 border rounded"
                            value={editingEvent ? editingEvent.title : newEvent.title}
                            onChange={(e) => {
                                if (editingEvent) {
                                    setEditingEvent({...editingEvent, title: e.target.value});
                                } else {
                                    setNewEvent({...newEvent, title: e.target.value});
                                }
                            }}
                        />
                    </label>
                </div>
                <div className="mb-3">
                    <label className="block font-medium mb-1">
                        Description:
                        <textarea
                            className="w-full p-2 border rounded"
                            value={editingEvent ? editingEvent.description || '' : newEvent.description}
                            onChange={e => {
                                if (editingEvent) {
                                    setEditingEvent({...editingEvent, description: e.target.value});
                                } else {
                                    setNewEvent({...newEvent, description: e.target.value});
                                }
                            }}
                        />
                    </label>
                </div>
                <div className="mb-3">
                    <label className="block font-medium mb-1">
                        Start Date:
                        <input
                            type="date"
                            className="w-full p-2 border rounded"
                            value={editingEvent
                                ? (editingEvent.startDate
                                    ? (typeof editingEvent.startDate === 'string'
                                        ? editingEvent.startDate.split('T')[0]
                                        : new Date(editingEvent.startDate).toISOString().split('T')[0])
                                    : '')
                                : (selectedDate
                                    ? (typeof selectedDate === 'string'
                                        ? selectedDate.split('T')[0]
                                        : new Date(selectedDate).toISOString().split('T')[0])
                                    : '')}
                            onChange={(e) => {
                                if (editingEvent) {
                                    setEditingEvent({...editingEvent, startDate: e.target.value});
                                } else {
                                    setSelectedDate(e.target.value);
                                }
                            }}
                        />
                    </label>
                </div>
                <div className="mb-3">
                    <label className="block font-medium mb-1">
                        End Date:
                        <input
                            type="date"
                            className="w-full p-2 border rounded"
                            value={
                                editingEvent
                                    ? editingEvent.endDate
                                        ? typeof editingEvent.endDate === 'string'
                                            ? editingEvent.endDate.split('T')[0]
                                            : new Date(editingEvent.endDate).toISOString().split('T')[0]
                                        : (
                                            editingEvent.startDate
                                                ? typeof editingEvent.startDate === 'string'
                                                    ? editingEvent.startDate.split('T')[0]
                                                    : new Date(editingEvent.startDate).toISOString().split('T')[0]
                                                : ''
                                        )
                                    : selectedEndDate
                                        ? typeof selectedEndDate === 'string'
                                            ? selectedEndDate.split('T')[0]
                                            : new Date(selectedEndDate).toISOString().split('T')[0]
                                        : (
                                            selectedDate
                                                ? typeof selectedDate === 'string'
                                                    ? selectedDate.split('T')[0]
                                                    : new Date(selectedDate).toISOString().split('T')[0]
                                                : ''
                                        )
                            }
                            onChange={(e) => {
                                if (editingEvent) {
                                    setEditingEvent({...editingEvent, endDate: e.target.value});
                                } else {
                                    setSelectedEndDate(e.target.value);
                                }
                            }}
                        />
                    </label>
                </div>
                <div className="mb-3">
                    <label className="block font-medium mb-1">
                        Off Day:
                        <input
                            type="checkbox"
                            className="ml-2"
                            checked={editingEvent ? editingEvent.isOffDay : newEvent.isOffDay}
                            onChange={(e) => {
                                if (editingEvent) {
                                    setEditingEvent({...editingEvent, isOffDay: e.target.checked});
                                } else {
                                    setNewEvent({...newEvent, isOffDay: e.target.checked});
                                }
                            }}
                        />
                    </label>
                </div>
                <div className="mb-3">
                    <label className="block font-medium mb-1">
                        Special Schedule:
                        <input 
                            type="checkbox" 
                            className="ml-2"
                            checked={editingEvent ? editingEvent.specialSchedule : newEvent.specialSchedule}
                            onChange={(e) => {
                                if (editingEvent) {
                                    setEditingEvent({...editingEvent, specialSchedule: e.target.checked});
                                } else {
                                    setNewEvent({...newEvent, specialSchedule: e.target.checked});
                                }
                            }}
                        />
                    </label>
                </div>
                {editingEvent ? (
                    <div className="flex gap-2 mt-4">
                        <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700" onClick={handleUpdateEvent}>Save Changes</button>
                        <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400" onClick={() => setEditingEvent(null)}>Cancel</button>
                    </div>
                ) : (
                    <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={handleCreateEvent}>Create Event</button>
                )}
            </div>
        </div>
    );
};

export default EventEditor;