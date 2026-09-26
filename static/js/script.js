document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('predictionForm');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');
    const getCurrentLocationBtn = document.getElementById('getCurrentLocation');
    
    if (form) {
        form.addEventListener('submit', handlePrediction);
    }
    
    if (getCurrentLocationBtn) {
        getCurrentLocationBtn.addEventListener('click', getCurrentLocation);
    }
    
    async function handlePrediction(e) {
        e.preventDefault();
        
        const latitude = parseFloat(document.getElementById('latitude').value);
        const longitude = parseFloat(document.getElementById('longitude').value);
        
        if (isNaN(latitude) || isNaN(longitude)) {
            alert('Please enter valid coordinates');
            return;
        }
        
        showLoading(true);
        
        try {
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    latitude: latitude,
                    longitude: longitude
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                displayResults(data);
            } else {
                throw new Error(data.error || 'Prediction failed');
            }
            
        } catch (error) {
            console.error('Error:', error);
            alert('Error making prediction: ' + error.message);
        } finally {
            showLoading(false);
        }
    }
    
    function displayResults(data) {
        const resultContent = document.getElementById('resultContent');
        const riskClass = data.risk_level.toLowerCase();
        
        resultContent.innerHTML = `
            <h4 style="color: ${data.color}">🎯 ${data.predicted_severity} Risk</h4>
            <div class="row">
                <div class="col-md-6">
                    <p><strong>📍 Location:</strong> ${data.location.lat.toFixed(4)}, ${data.location.lon.toFixed(4)}</p>
                    <p><strong>⚠️ Risk Level:</strong> <span class="risk-${riskClass}">${data.risk_level}</span></p>
                    <p><strong>🎯 Confidence:</strong> ${(data.confidence * 100).toFixed(1)}%</p>
                </div>
                <div class="col-md-6">
                    <p><strong>📊 Probabilities:</strong></p>
                    <div class="progress mb-2" style="height: 20px;">
                        <div class="progress-bar bg-success" style="width: ${data.probabilities.slight * 100}%">
                            Slight: ${(data.probabilities.slight * 100).toFixed(1)}%
                        </div>
                        <div class="progress-bar bg-warning" style="width: ${data.probabilities.serious * 100}%">
                            Serious: ${(data.probabilities.serious * 100).toFixed(1)}%
                        </div>
                        <div class="progress-bar bg-danger" style="width: ${data.probabilities.fatal * 100}%">
                            Fatal: ${(data.probabilities.fatal * 100).toFixed(1)}%
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-3 p-3 rounded" style="background-color: ${data.color}20;">
                <small><strong>💡 Prediction made at:</strong> ${new Date(data.timestamp).toLocaleString()}</small>
            </div>
        `;
        
        results.style.display = 'block';
        results.scrollIntoView({ behavior: 'smooth' });
    }
    
    function showLoading(show) {
        loading.style.display = show ? 'block' : 'none';
        if (show) {
            results.style.display = 'none';
        }
    }
    
    function getCurrentLocation() {
        if (navigator.geolocation) {
            getCurrentLocationBtn.innerHTML = '⏳ Getting location...';
            getCurrentLocationBtn.disabled = true;
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    document.getElementById('latitude').value = position.coords.latitude.toFixed(6);
                    document.getElementById('longitude').value = position.coords.longitude.toFixed(6);
                    getCurrentLocationBtn.innerHTML = 'Use My Location 📍';
                    getCurrentLocationBtn.disabled = false;
                },
                function(error) {
                    alert('Error getting location: ' + error.message);
                    getCurrentLocationBtn.innerHTML = 'Use My Location 📍';
                    getCurrentLocationBtn.disabled = false;
                }
            );
        } else {
            alert('Geolocation is not supported by this browser');
        }
    }
});

// GPS Location Detection and Integration System
// Add this to your HTML template or separate JS file

class LocationService {
    constructor() {
        this.currentLocation = null;
        this.isDetecting = false;
    }

    // Main function to get current GPS location
    async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by this browser'));
                return;
            }

            // Show loading state
            this.showLocationLoading();

            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000 // Cache for 1 minute
            };

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const coords = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            accuracy: position.coords.accuracy
                        };

                        console.log('🌍 GPS coordinates obtained:', coords);
                        
                        // Send coordinates to backend for location resolution
                        const locationData = await this.resolveLocation(coords);
                        
                        this.currentLocation = locationData;
                        this.hideLocationLoading();
                        resolve(locationData);
                        
                    } catch (error) {
                        this.hideLocationLoading();
                        reject(error);
                    }
                },
                (error) => {
                    this.hideLocationLoading();
                    let errorMessage = 'Location detection failed';
                    
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'Location access denied by user';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'Location information unavailable';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'Location request timed out';
                            break;
                    }
                    
                    console.error('🚫 GPS Error:', errorMessage);
                    reject(new Error(errorMessage));
                },
                options
            );
        });
    }

    // Send coordinates to backend for location resolution
    async resolveLocation(coords) {
        try {
            const response = await fetch('/api/get_location', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                    accuracy: coords.accuracy
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success) {
                console.log('✅ Location resolved:', data.location);
                return data;
            } else {
                throw new Error(data.error || 'Location resolution failed');
            }
            
        } catch (error) {
            console.error('❌ Location resolution error:', error);
            throw error;
        }
    }

    // Show loading indicator
    showLocationLoading() {
        const button = document.getElementById('use-location-btn');
        const locationInput = document.getElementById('location');
        
        if (button) {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Detecting Location...';
            button.disabled = true;
            button.classList.add('loading');
        }
        
        if (locationInput) {
            locationInput.placeholder = 'Detecting your location...';
            locationInput.disabled = true;
        }
        
        this.isDetecting = true;
    }

    // Hide loading indicator
    hideLocationLoading() {
        const button = document.getElementById('use-location-btn');
        const locationInput = document.getElementById('location');
        
        if (button) {
            button.innerHTML = '<i class="fas fa-map-marker-alt"></i> Use Current Location';
            button.disabled = false;
            button.classList.remove('loading');
        }
        
        if (locationInput) {
            locationInput.placeholder = 'Enter your location...';
            locationInput.disabled = false;
        }
        
        this.isDetecting = false;
    }

    // Update location input field
    updateLocationInput(locationData) {
        const locationInput = document.getElementById('location');
        if (locationInput && locationData) {
            locationInput.value = locationData.location;
            
            // Add visual feedback
            locationInput.classList.add('location-detected');
            setTimeout(() => {
                locationInput.classList.remove('location-detected');
            }, 2000);
            
            // Store coordinates for advanced features
            locationInput.setAttribute('data-lat', locationData.coordinates.lat);
            locationInput.setAttribute('data-lon', locationData.coordinates.lon);
            locationInput.setAttribute('data-area-type', locationData.area_type);
            
            // Show success message
            this.showLocationSuccess(locationData);
        }
    }

    // Show success message
    showLocationSuccess(locationData) {
        const successMsg = document.createElement('div');
        successMsg.className = 'location-success-msg';
        successMsg.innerHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="fas fa-map-marker-alt text-success"></i>
                <strong>Location Detected!</strong> ${locationData.location}
                <small class="d-block text-muted">
                    Method: ${locationData.method} | Accuracy: ${locationData.accuracy}
                </small>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        const container = document.querySelector('.location-input-group') || document.querySelector('form');
        if (container) {
            container.appendChild(successMsg);
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                if (successMsg.parentNode) {
                    successMsg.remove();
                }
            }, 5000);
        }
    }

    // Show error message
    showLocationError(error) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'location-error-msg';
        errorMsg.innerHTML = `
            <div class="alert alert-warning alert-dismissible fade show" role="alert">
                <i class="fas fa-exclamation-triangle text-warning"></i>
                <strong>Location Detection Failed</strong>
                <div class="small text-muted">${error.message}</div>
                <div class="mt-2">
                    <small>Please enter your location manually or check location permissions.</small>
                </div>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        const container = document.querySelector('.location-input-group') || document.querySelector('form');
        if (container) {
            container.appendChild(errorMsg);
            
            // Auto remove after 8 seconds
            setTimeout(() => {
                if (errorMsg.parentNode) {
                    errorMsg.remove();
                }
            }, 8000);
        }
    }

    // Check if location services are available
    isLocationAvailable() {
        return 'geolocation' in navigator;
    }

    // Get location accuracy status
    getAccuracyStatus(accuracy) {
        if (accuracy <= 10) return 'Excellent';
        if (accuracy <= 50) return 'Good';
        if (accuracy <= 100) return 'Fair';
        return 'Poor';
    }
}

// Initialize location service
const locationService = new LocationService();

// Event handlers
document.addEventListener('DOMContentLoaded', function() {
    
    // Use Current Location button handler
    const useLocationBtn = document.getElementById('use-location-btn');
    if (useLocationBtn) {
        useLocationBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            if (!locationService.isLocationAvailable()) {
                alert('Geolocation is not supported by your browser. Please enter location manually.');
                return;
            }
            
            try {
                const locationData = await locationService.getCurrentLocation();
                locationService.updateLocationInput(locationData);
                
            } catch (error) {
                console.error('Location detection failed:', error);
                locationService.showLocationError(error);
            }
        });
    }

    // Auto-detect location on page load (optional)
    const autoDetectLocation = document.getElementById('auto-detect-location');
    if (autoDetectLocation && autoDetectLocation.checked) {
        setTimeout(() => {
            if (useLocationBtn) {
                useLocationBtn.click();
            }
        }, 1000);
    }

    // Location input validation and formatting
    const locationInput = document.getElementById('location');
    if (locationInput) {
        locationInput.addEventListener('input', function() {
            // Remove location-detected class when user types
            this.classList.remove('location-detected');
            
            // Basic validation
            const value = this.value.trim();
            if (value.length < 3) {
                this.classList.add('is-invalid');
            } else {
                this.classList.remove('is-invalid');
                this.classList.add('is-valid');
            }
        });
    }
});

// Enhanced prediction form with location integration
function submitPredictionForm() {
    const form = document.getElementById('prediction-form');
    const locationInput = document.getElementById('location');
    
    if (!form || !locationInput) return;
    
    // Validate location
    if (!locationInput.value.trim()) {
        alert('Please enter a location or use current location detection.');
        locationInput.focus();
        return;
    }
    
    // Add loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing Risk...';
        submitBtn.disabled = true;
    }
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Add GPS coordinates if available
    if (locationInput.hasAttribute('data-lat')) {
        data.gps_latitude = locationInput.getAttribute('data-lat');
        data.gps_longitude = locationInput.getAttribute('data-lon');
        data.area_type = locationInput.getAttribute('data-area-type');
    }
    
    // Submit to API
    fetch('/api/predict_comprehensive', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            // Store result and redirect
            sessionStorage.setItem('prediction_result', JSON.stringify(result));
            window.location.href = '/results';
        } else {
            throw new Error(result.error || 'Prediction failed');
        }
    })
    .catch(error => {
        console.error('Prediction error:', error);
        alert('Prediction failed: ' + error.message);
    })
    .finally(() => {
        // Reset submit button
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-search"></i> Predict Risk';
            submitBtn.disabled = false;
        }
    });
}

// CSS styles for location detection (add to your CSS file)
const locationStyles = `
<style>
.location-detected {
    border-color: #28a745 !important;
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25) !important;
    background-color: #f8fff9 !important;
}

.loading {
    opacity: 0.7;
    cursor: not-allowed !important;
}

.location-success-msg,
.location-error-msg {
    margin-top: 10px;
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.location-input-group {
    position: relative;
}

#use-location-btn {
    transition: all 0.3s ease;
}

#use-location-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.location-accuracy-indicator {
    font-size: 0.8em;
    padding: 2px 6px;
    border-radius: 10px;
    display: inline-block;
    margin-left: 5px;
}

.accuracy-excellent { background: #d4edda; color: #155724; }
.accuracy-good { background: #cce5ff; color: #004085; }
.accuracy-fair { background: #fff3cd; color: #856404; }
.accuracy-poor { background: #f8d7da; color: #721c24; }
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', locationStyles);