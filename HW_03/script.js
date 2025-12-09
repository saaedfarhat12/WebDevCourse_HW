const form = document.getElementById('songForm');
const list = document.getElementById('songList');
const submitBtn = document.getElementById('submitBtn');
const sortSelect = document.getElementById('sort');
const searchInput = document.getElementById('search');
const cardContainer = document.getElementById('cardView');
const toggleBtn = document.getElementById('toggleViewBtn');
const toggleIcon = document.getElementById('toggleIcon');
const videoModal = document.getElementById('videoModal');
const videoContainer = document.getElementById('videoContainer');
const closeModal = document.getElementById('closeModal');

let songs = JSON.parse(localStorage.getItem('songs')) || [];
let isTableView = true;

// Extract YouTube video ID
function extractYouTubeID(url) {
    const regex = /(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Add / Update song
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const rating = document.getElementById('rating').value;
    const id = document.getElementById('songId').value;

    if (id) {
        const index = songs.findIndex(s => s.id == id);
        songs[index].title = title;
        songs[index].url = url;
        songs[index].rating = rating;
        submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
        submitBtn.classList.replace('btn-warning', 'btn-success');
        document.getElementById('songId').value = '';
    } else {
        const videoID = extractYouTubeID(url);
        const thumbnailURL = videoID ? `https://img.youtube.com/vi/${videoID}/hqdefault.jpg` : '';
        const song = {
            id: Date.now(),
            title,
            url,
            rating,
            videoID,
            thumbnail: thumbnailURL,
            dateAdded: Date.now()
        };
        songs.push(song);
    }

    saveAndRender();
    form.reset();
});

// Save songs to localStorage and render
function saveAndRender() {
    localStorage.setItem('songs', JSON.stringify(songs));
    renderSongs();
}

// Render songs (table or card)
function renderSongs() {
    const searchText = searchInput.value.toLowerCase();
    let filteredSongs = songs.filter(song => song.title.toLowerCase().includes(searchText));

    // Sorting
    const selectedSort = sortSelect.value;
    if (selectedSort === 'az') filteredSongs.sort((a,b)=>a.title.localeCompare(b.title));
    else if (selectedSort === 'newest') filteredSongs.sort((a,b)=>b.dateAdded - a.dateAdded);
    else if (selectedSort === 'rating') filteredSongs.sort((a,b)=>b.rating - a.rating);

    if (isTableView) {
        // Table view
        list.innerHTML = '';
        filteredSongs.forEach(song => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    ${song.thumbnail ? `<img src="${song.thumbnail}" width="120" class="rounded" style="cursor:pointer;" onclick="openVideo('${song.videoID}')">` : ''}
                </td>
                <td>${song.title}</td>
                <td><a href="${song.url}" target="_blank" class="text-info">Watch</a></td>
                <td>${song.rating}</td>
                <td class="text-end">
                    <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})"><i class="fas fa-trash"></i></button>
                </td>
            `;
            list.appendChild(row);
        });
        list.parentElement.classList.remove('d-none');
        cardContainer.classList.add('d-none');
    } else {
        // Card view
        renderCards(filteredSongs);
        list.parentElement.classList.add('d-none');
        cardContainer.classList.remove('d-none');
    }
}

// Render songs as cards
function renderCards(songsToRender) {
    cardContainer.innerHTML = '';
    songsToRender.forEach(song => {
        const card = document.createElement('div');
        card.className = 'col-md-4 mb-3';
        card.innerHTML = `
            <div class="card h-100">
                <img src="${song.thumbnail}" class="card-img-top" alt="${song.title}" style="cursor:pointer;" onclick="openVideo('${song.videoID}')">
                <div class="card-body">
                    <h5 class="card-title">${song.title}</h5>
                    <p class="card-text">Rating: ${song.rating}</p>
                    <a href="${song.url}" target="_blank" class="btn btn-primary w-100">Watch</a>
                </div>
            </div>
        `;
        cardContainer.appendChild(card);
    });
}

// Delete song
function deleteSong(id) {
    if(confirm('Are you sure?')) {
        songs = songs.filter(s => s.id !== id);
        saveAndRender();
    }
}

// Edit song
function editSong(id) {
    const song = songs.find(s => s.id === id);
    document.getElementById('title').value = song.title;
    document.getElementById('url').value = song.url;
    document.getElementById('rating').value = song.rating;
    document.getElementById('songId').value = song.id;
    submitBtn.innerHTML = '<i class="fas fa-save"></i> Update';
    submitBtn.classList.replace('btn-success', 'btn-warning');
}

// Open video modal
function openVideo(videoID) {
    videoContainer.innerHTML = `<iframe width="100%" height="450" src="https://www.youtube.com/embed/${videoID}" frameborder="0" allowfullscreen></iframe>`;
    videoModal.style.display = 'flex';
}

// Close modal
closeModal.addEventListener('click', () => {
    videoModal.style.display = 'none';
    videoContainer.innerHTML = '';
});

// Toggle table/card view
toggleBtn.addEventListener('click', () => {
    isTableView = !isTableView;
    toggleIcon.className = isTableView ? 'fas fa-table' : 'fas fa-th-large';
    renderSongs();
});

// Re-render on sort or search
sortSelect.addEventListener('change', renderSongs);
searchInput.addEventListener('input', renderSongs);

// Initial render
renderSongs();