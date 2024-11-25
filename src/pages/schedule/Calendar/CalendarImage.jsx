import React, { useState, useEffect } from 'react';

const CalendarImage = () => {
  const [images, setImages] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch all images on component load
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/schedule/calendar', { method: 'GET' });
        if (response.ok) {
          const data = await response.json();
            console.log(data);
          setImages(data);
        } else {
          console.error('Failed to fetch images:', await response.json());
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      // Preview image
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert('Please select an image before submitting.');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    const reader = new FileReader();
    reader.onload = async () => {
      const imgUrl = reader.result;
      formData.append('imgUrl', imgUrl);

    try {
        const response = await fetch('/api/schedule/calendar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({imgUrl})
        });

        if (response.ok) {
            const newImage = await response.json();
            setImages((prevImages) => [...prevImages, newImage]);
            alert('Image uploaded successfully!');
        } else {
            const errorData = await response.json();
            alert('Failed to upload image: ' + errorData.message);
    }
    } catch (error) {
        console.error('Error uploading image:', error);
        alert('An error occurred. Please try again.');
    } finally {
        setLoading(false);
    
    }
    }

    reader.readAsDataURL(image);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/schedule/calendar`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setImages((prevImages) => prevImages.filter((img) => img._id !== id));
        alert('Image deleted successfully!');
      } else {
        const errorData = await response.json();
        alert('Failed to delete image: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-4">Image Manager</h1>

      {/* Upload Section */}
      <div className="mb-4">
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className="mb-2" style={{ width: '250px', height: '375px' }} />
        ) : (
          <div className="mb-2 bg-gray-300" style={{ width: '150px', height: '150px' }}>
            No Image Selected
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-2 p-2 border rounded-md"
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="py-2 px-4 mt-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md"
        >
          {loading ? 'Uploading...' : 'Upload Image'}
        </button>
      </div>

      {/* Images Display */}
      <div className="grid grid-cols-3 gap-4">
        {images.map((img) => (
            
          <div key={img._id} className="flex flex-col items-center">
            {console.log(img)}
            <img
              src={img.imgUrl}
              alt="Calendar"
              className="mb-2 border rounded-md"
              style={{ width: '150px', height: '150px' }}
            />
            <button
              onClick={() => handleDelete(img._id)}
              className="py-1 px-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarImage;
