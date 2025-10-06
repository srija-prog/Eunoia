(function() { //starts the iife
    let myStories = [];
    //empty array for stories
    try { myStories = JSON.parse(localStorage.getItem('myStories') || '[]') || []; } catch (_) { myStories = []; }
    //try to get saved stories from localStorage
    //if none, use empty array

    const myStory = document.querySelector('.story-item.my-story');
    //find the my story boox
    if (!myStory) return;
    //if not found stop the code

    const fileInput = myStory.querySelector('input[type="file"]') || document.getElementById('story-upload');
    //find the hindden file input where the user uploads stories
    const avatar = myStory.querySelector('.story-avatar img');
    //find the default avatar image for the story box
    const storiesBar = document.querySelector('.stories-bar');
    //find the container that holds all the stories

    function createStoryCircle(imgSrc) {
        //create one story circle element
        const newStory = document.createElement('div');
        //makes a new story div with the previous styles
        newStory.classList.add('story-item', 'user-story');

        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('story-avatar');
        //creating a container to hold the story image
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = 'My Story';
        avatarDiv.appendChild(img);
        //adds the story into the circle
        const span = document.createElement('span');
        span.textContent = 'My Story';
        //small label under the circle
        newStory.appendChild(avatarDiv);
        newStory.appendChild(span);
        //combine the circle and label into one story box
        newStory.addEventListener('click', (e) => {
            e.preventDefault(); //stop unwanted link behavior
            e.stopPropagation(); // stop bubbling to parents
            openStoryModal(myStories.indexOf(imgSrc));
        });
        return newStory;
        //returns this complete story
    }

    // Ensure modal exists
    function ensureModal() {
        let modal = document.querySelector('.story-viewer');
        //check if modal already exists
        if (!modal) {
            //create the modal if it doesn't exist
            modal = document.createElement('div');
            //makes the modal container
            modal.className = 'story-viewer';
            // basic visible backdrop and centering; you can override via CSS
            modal.style.position = 'fixed';
            modal.style.inset = '0';
            modal.style.background = 'rgba(240, 160, 234, 0.84)';
            modal.style.display = 'none';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.zIndex = '9999';
            
            // 🩷 buttery fade transition added
            modal.style.opacity = '0';
            modal.style.transition = 'opacity 0.4s ease';

            const content = document.createElement('div');
            content.className = 'story-viewer-content';
            //contains the actual story content
            // half window size
            content.style.width = '50vw';
            content.style.height = '50vh';
            content.style.backgroundImage = "url('forSmallScreen.jpg')";
            content.style.borderRadius = '22px';
            content.style.border = '10px, solid , pink';
            content.style.position = 'relative';
            content.style.display = 'flex';
            content.style.justifyContent = 'center';
            content.style.alignItems = 'center';
            // 🩷 buttery zoom transition added
            content.style.transform = 'scale(0.9)';
            content.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
            //centers the image inside the frame
            const img = document.createElement('img');
            img.className = 'story-viewer-image';
            img.style.maxWidth = '90%';
            img.style.maxHeight = '90%';
            img.style.borderRadius = '12px';
            img.style.boxShadow = '12px'
            //here is the actual story image
            const closeBtn = document.createElement('button');
            closeBtn.className = 'story-viewer-close';
            closeBtn.setAttribute('aria-label', 'Close');
            closeBtn.textContent = '×';
            //the close button
            // place at top-right of the frame
            closeBtn.style.position = 'absolute';
            closeBtn.style.top = '10px';
            closeBtn.style.right = '10px';
            closeBtn.style.background = 'solid #d614c9ff';
            closeBtn.style.border = '15px, solid, #d614c9ff';
            closeBtn.style.borderRadius = '12px';
            closeBtn.style.color = '#000000ff';
            closeBtn.style.fontSize = '24px';
            closeBtn.style.cursor = 'pointer';
            
            // 🩷 buttery fade-out + zoom-out animation
            closeBtn.addEventListener('click', () => { 
                content.style.transform = 'scale(0.9)';
                modal.style.opacity = '0';
                setTimeout(() => {
                    modal.classList.remove('open'); 
                    modal.style.display = 'none'; 
                }, 400); // match transition duration
            });

            //clicking it closes the modal
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'story-viewer-next';
            nextBtn.textContent = 'Next';
            //button to go to next story
            // place at bottom-right of the frame
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
            //assembbles everything and adds to the page
        }
        return modal;
        //returns so that the modal can be used
    }

    function openStoryModal(index) {
        //opens the modal and shows the story at the given index
        if (!myStories.length) return;
        //no stories, do nothing
        if (typeof index !== 'number' || index < 0 || index >= myStories.length) index = myStories.length - 1;
        //if index is invalid, show the latest story
        const modal = ensureModal();
        const img = modal.querySelector('.story-viewer-image');
        const nextBtn = modal.querySelector('.story-viewer-next');
        const content = modal.querySelector('.story-viewer-content');
        modal.classList.add('open');
        
        // 🩷 buttery fade-in + zoom-in animation
        modal.style.display = 'flex';
        modal.style.opacity = '0';
        content.style.transform = 'scale(0.9)';
        requestAnimationFrame(() => {
            modal.style.opacity = '1';
            content.style.transform = 'scale(1)';
        });

        //fetches the elements inside the modal and makes it visible
        let currentIndex = index;

        function render() {
            img.src = myStories[currentIndex];
            //shows the current story image
        }
        function goNext() {
            currentIndex = (currentIndex + 1) % myStories.length;
            render();
            //goes to next story, loops back to start
        }
        render();
        img.onclick = goNext;
        if (nextBtn) nextBtn.onclick = goNext;
        //clicking image or next button goes to next story
    }

    // Render saved circles on load
    if (storiesBar && Array.isArray(myStories)) {
        myStories.forEach((src) => {
            storiesBar.appendChild(createStoryCircle(src));
        });
    }

    // Upload new stories (multiple) -> save all; do not add new circles
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const files = (e.target.files && Array.from(e.target.files)) || [];
            if (!files.length) return;
            let remaining = files.length;
            files.forEach((file) => {
                const reader = new FileReader();
                reader.onload = function(ev) {
                    const imgSrc = ev.target.result;
                    myStories.push(imgSrc);
                    remaining -= 1;
                    if (remaining === 0) {
                        localStorage.setItem('myStories', JSON.stringify(myStories));
                    }
                };
                reader.readAsDataURL(file);
            });
        });
    }

    // Clicking avatar opens latest story
    if (avatar) {
        avatar.addEventListener('click', () => {
            if (!myStories.length) return;
            openStoryModal(myStories.length - 1);
        });
    }
})();

//i wrote these comments to explain the code better
// now i think i am going to die
//i'll complete the dashboard css before i die.....................
