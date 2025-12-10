// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-nFiiU39vEYtSAe5t1Q7Q3S9AjlThJ6Y",
  authDomain: "helpalways-waitlist.firebaseapp.com",
  projectId: "helpalways-waitlist",
  storageBucket: "helpalways-waitlist.firebasestorage.app",
  messagingSenderId: "7200113048",
  appId: "1:7200113048:web:6e5666c33ac73c50a0abed",
  measurementId: "G-W8BJ0C63M2"
};

// Initialize Firebase and Firestore
let db;
try {
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        console.log('Firebase connected successfully');
    } else {
        console.error('Firebase SDK not loaded');
    }
} catch (error) {
    console.error('Firebase initialization error:', error);
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const waitlistForm = document.getElementById('waitlistForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    
    if (!waitlistForm || !submitBtn) {
        console.error('Form elements not found');
        return;
    }

    // Form submission handler
    waitlistForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        if (btnLoader) {
            btnLoader.style.display = 'inline-block';
        }
        
        // Get form values
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const businessName = document.getElementById('businessName').value.trim();
        const notify = document.getElementById('notify').checked;
        
        // Create data object
        const waitlistData = {
            fullName: fullName,
            email: email,
            businessName: businessName || null,
            notify: notify,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            createdAt: new Date().toISOString()
        };
        
        try {
            // Check if Firebase is initialized
            if (!db) {
                throw new Error('Firebase not initialized');
            }
            
            // Save to Firestore
            await db.collection('waitlist').add(waitlistData);
            
            // Hide form and show success message
            waitlistForm.style.display = 'none';
            if (successMessage) {
                successMessage.style.display = 'block';
            }
            
            // Reset form
            waitlistForm.reset();
            
        } catch (error) {
            console.error('Error adding document: ', error);
            
            // Show error message to user
            alert('There was an error submitting your information. Please try again.');
            
            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            if (btnLoader) {
                btnLoader.style.display = 'none';
            }
        }
    });
});

