(function() { //starts the iife
    // 1. Correct Data Structure and Scoping
    let userStories = {
        'my': [], // This will hold the main user's stories
        'alice': [],
        'baby': [],
        'cat': [],
        'belle': [],
        'bunny': [],
        'ella': [],
        'jack': [],
        'olaf': [],
        'sunny': [],
        'tess': [],
        'whiti': []
    };

    const STORAGE_KEY = 'eunoiaUserStories'; 

    // Try to load all stories from localStorage
    try { 
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if(stored && typeof stored === 'object'){
            userStories = {...userStories, ...stored};
        }
    } catch(_){
        // userSTORIES remains the initial structure
    }

    const myStory = document.querySelector('.story-item.my-story');
    if (!myStory) return;

    // We keep the main user's file input reference for later use
    const myFileInput = document.getElementById('story-upload');
    
    // We get the story bar container
    const storiesBar = document.querySelector('.stories-bar');
    
    // 2. Define Modal Elements in Outer Scope
    let modal, content, img, nextBtn;


    function createStoryCircle(imgSrc) {
        // create one story circle element
        const newStory = document.createElement('div');
        newStory.classList.add('story-item', 'user-story');

        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('story-avatar');
        
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = 'My Story';
        avatarDiv.appendChild(img);
        
        const span = document.createElement('span');
        span.textContent = 'My Story';
        
        newStory.appendChild(avatarDiv);
        newStory.appendChild(span);
        
        newStory.addEventListener('click', (e) => {
            e.preventDefault(); 
            e.stopPropagation(); 
            const myStoriesArray = userStories['my'] || []; // Get array from data object
            openStoryModal('my', myStoriesArray.indexOf(imgSrc)); // Correct signature
        });
        return newStory;
    }

    /**
     * Handles processing uploaded files and saving them to the correct user.
     * This is the generalized function for ALL uploads (My Story and Friends).
     * @param {string} storyKey - The key ('my', 'alice', etc.) to save the stories under.
     * @param {File[]} files - Array of File objects to upload.
     */
    function handleFileUpload(storyKey, files) {
        if (!files.length) return;
        let remaining = files.length;
        
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = function(ev) {
                const imgSrc = ev.target.result;
                
                // Ensure the target array exists and is an array
                if (!Array.isArray(userStories[storyKey])) {
                    userStories[storyKey] = [];
                }
                userStories[storyKey].push(imgSrc); 
                
                remaining -= 1;
                if (remaining === 0) {
                    // Save the entire object to localStorage after all files are processed
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(userStories));
                    // Since stories are uploaded, refresh the page to show the story circle border
                    window.location.reload(); 
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // Modal creation logic remains the same (ensureModal and openStoryModal)
    function ensureModal() {
        modal = document.querySelector('.story-viewer');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'story-viewer';
            // ... (modal styles)
            modal.style.position = 'fixed';
            modal.style.inset = '0';
            modal.style.background = 'rgba(240, 160, 234, 0.84)';
            modal.style.display = 'none';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.zIndex = '9999';
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.4s ease';

            content = document.createElement('div');
            content.className = 'story-viewer-content';
            // ... (content styles)
            content.style.width = '50vw';
            content.style.height = '50vh';
            content.style.backgroundImage = "url('forSmallScreen.jpg')";
            content.style.borderRadius = '22px';
            content.style.border = '10px, solid , pink';
            content.style.position = 'relative';
            content.style.display = 'flex';
            content.style.justifyContent = 'center';
            content.style.alignItems = 'center';
            content.style.transform = 'scale(0.9)';
            content.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
            
            img = document.createElement('img');
            img.className = 'story-viewer-image';
            img.style.maxWidth = '90%';
            img.style.maxHeight = '90%';
            img.style.borderRadius = '12px';
            img.style.boxShadow = '12px'
            
            const closeBtn = document.createElement('button');
            closeBtn.className = 'story-viewer-close';
            closeBtn.setAttribute('aria-label', 'Close');
            closeBtn.textContent = '×';
            // ... (closeBtn styles)
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '10px';
            closeBtn.style.right = '10px';
            closeBtn.style.background = 'solid #d614c9ff';
            closeBtn.style.border = '15px, solid , #d614c9ff';
            closeBtn.style.borderRadius = '12px';
            closeBtn.style.color = '#000000ff';
            closeBtn.style.fontSize = '24px';
            closeBtn.style.cursor = 'pointer';
            
            closeBtn.addEventListener('click', () => { 
                content.style.transform = 'scale(0.9)';
                modal.style.opacity = '0';
                setTimeout(() => {
                    modal.classList.remove('open'); 
                    modal.style.display = 'none'; 
                }, 400);
            });
            
            nextBtn = document.createElement('button');
            nextBtn.className = 'story-viewer-next';
            nextBtn.textContent = 'Next';
            // ... (nextBtn styles)
            nextBtn.style.position = 'absolute';
            nextBtn.style.bottom = '10px';
            nextBtn.style.right = '12px';
            nextBtn.style.background = 'rgba(224, 95, 229, 0.86)';
            nextBtn.style.color = '#100b0bff';
            nextBtn.style.border = '15px solid rgba(240, 10, 198, 0.4)';
            nextBtn.style.borderRadius= '12px';
            nextBtn.style.borderRadius = '8px';
            nextBtn.style.padding = '6px 10px';
            nextBtn.style.cursor = 'pointer';

            content.appendChild(closeBtn);
            content.appendChild(img);
            content.appendChild(nextBtn);
            modal.appendChild(content);
            document.body.appendChild(modal);
        }
        return modal;
    }
    
    ensureModal(); 

    function openStoryModal(storyKey, index) { 
        const currentStories = userStories[storyKey] || [];
        
        if (!currentStories.length) return; 

        if (typeof index !== 'number' || index < 0 || index >= currentStories.length) index = currentStories.length - 1;
        
        let currentIndex = index; 
        
        function render() {
            img.src = currentStories[currentIndex]; 
        }

        modal.style.display = 'flex';
        modal.style.opacity = '0';
        content.style.transform = 'scale(0.9)';
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            content.style.transform = 'scale(1)';
        });

        function goNext() {
            currentIndex = (currentIndex + 1) % currentStories.length; 
            render();
        }
        
        render();
        img.onclick = goNext;
        if (nextBtn) nextBtn.onclick = goNext;
    }


    // Render saved circles on load
    const myStoriesArray = userStories['my'] || [];
    if (storiesBar && Array.isArray(myStoriesArray)) {
        myStoriesArray.forEach((src) => {
            storiesBar.appendChild(createStoryCircle(src));
        });
    }


    // ====================================================================
    // 3. UNIFIED STORY CLICK HANDLER (Upload or View)
    // This replaces the separate fileInput, avatar, and friendStories blocks.
    // ====================================================================

    // Select ALL story items (my-story and friend-story)
    const allStoryItems = storiesBar.querySelectorAll('.story-item');
    
    if (allStoryItems.length) { 
        allStoryItems.forEach(storyItem => {
            
            // Get the unique ID key for this story item ('my' or 'alice', 'baby', etc.)
            const storyKey = storyItem.getAttribute('data-story-id') || (storyItem.classList.contains('my-story') ? 'my' : null);
            
            if (!storyKey) return; // Skip if no key can be determined

            const storiesArray = userStories[storyKey] || [];
            
            // The click listener is added to the story item box
            storyItem.addEventListener('click', (e) => {
                
                // Determine which file input corresponds to this storyKey
                // Assumes: 'my' uses 'story-upload', friends use 'friendKey-story-upload'
                const targetFileInput = (storyKey === 'my') 
                    ? myFileInput 
                    : document.getElementById(`${storyKey}-story-upload`);

                // Check if the avatar or upload-related part was clicked
                if (e.target.closest('.story-avatar') || e.target.classList.contains('upload-icon')) {
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    
                    if (!storiesArray.length) {
                        // === CASE 1: NO STORIES PRESENT -> TRIGGER UPLOAD ===
                        
                        if (targetFileInput) { 
                            // Attach a temporary listener to handle the selected files
                            targetFileInput.onchange = (ev) => {
                                const files = (ev.target.files && Array.from(ev.target.files)) || [];
                                if (files.length) {
                                    // Use the generalized function to save to the correct key!
                                    handleFileUpload(storyKey, files); 
                                }
                                // Clean up the listener after execution
                                targetFileInput.onchange = null;
                            };
                            
                            // Trigger the click on the hidden file input
                            targetFileInput.click(); 
                        } else {
                            console.log(`Upload input not found for ${storyKey}. Please ensure id="${storyKey}-story-upload" exists in dashboard.html.`);
                        }
                        return; // Stop execution after triggering upload
                    }
                    
                    // === CASE 2: STORIES ARE PRESENT -> OPEN VIEWER ===
                    openStoryModal(storyKey, storiesArray.length - 1); 
                }
            });
        });
    }

})();
