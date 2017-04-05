/**
  *
  * PAGES
  *
  **/
var _pages = {};

_pages.changePage = function (ev) {
    console.log(ev);
    var title = ev.currentTarget.document.getElementsByClassName('title')[0];
    var pageName = title.dataset.title;
    console.log(pageName);
    switch (pageName) {
        case "index":
            _pages.main();
            break;
        case "gifts":
            _pages.gifts();
            break;
    }
};

_pages.main = function () {

};

_pages.gifts = function () {

};

_pages.save = function () {
    
};

_pages.savePerson = function () {
    
};

_pages.cancelModal = function () {
    var evt = new CustomEvent('touchend', {bubbles: true, cancelable: true});
    
    var button = document.getElementById('x');
    button.dispatchEvent(evt);
};

/**
  *
  * LOCAL STORAGE
  *
  **/
var _localStorage = {};

_localStorage.key = 'giftr-bowe0145';

_localStorage.load = function () {
    // Load the JSON from localstorage
        var item = localStorage.getItem(_localStorage.key);
        // It didn't want to parse it so I just kept telling it to parse
        item = JSON.parse(item);
        // Return the item to be used as json
        return JSON.parse(item);
};

_localStorage.save = function () {
    
};

_localStorage.savePerson = function () {
    
};

_localStorage.saveIdea = function () {
    
};

/**
  *
  * APP
  *
  **/
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    showHome: function (ev) {
        
        // Get the elements
        var personX = document.getElementById('person-x');
        var personClose = document.getElementById('person-close');
        var personSave = document.getElementById('person-save');

        // Listeners
        //personClose.addEventListener('touchstart', _pages.closePerson);
        //personX.addEventListener('touchstart', _pages.closePerson);
        //personSave.addEventListener('touchstart', _pages.savePerson);
        
        // Fill the page
        app.fillPeople();
    },
    showGifts: function (ev) {
        // Get the elements
        var giftX = document.getElementById('x');
        var giftClose = document.getElementById('gift-close');
        var giftSave = document.getElementById('gift-save');
        
        // Listeners
        giftClose.addEventListener('touchstart',_pages.closeIdea(ev));
        giftX.addEventListener('touchstart', _pages.closeIdea(ev));
        giftSave.addEventListener('touchstart',_pages.saveIdea(ev));
        
        // Fill the page
        app.fillIdeas(ev);
    },
    fillPeople: function () {
        // The list container
        var container = document.getElementById('contact-list');
        container.innerHTML = "";
        // Load the json from localstorage
        var people = _localStorage.load();
        
        // If there's no localstorage then don't bother looping
        if (people.people.length > 0) {
            // Loop through each person
            for (var i = 0;i < people.people.length; i++) {
                var tablecell = document.createElement("LI");
                var spanName = document.createElement("SPAN");
                var aName = document.createElement("A");
                var aLink = document.createElement("A");
                var spanDate = document.createElement("SPAN");
                
                tablecell.classList.add("table-view-cell");
                
                spanName.classList.add("name");
                aName.href = "#personModal";
                aName.textContent = people.people[i].name;
                aName.dataset.id = people.people[i].id;
                
                aName.addEventListener('touchstart', function (person) {
                    return function () {
                        currentPerson = person;
                        var container = document.getElementById('personModal');
                        
                        var title = document.getElementById('person-title');
                        //title.textContent = "Edit Person";
                        
                        var name = document.getElementById('person-name');
                        name.value = person.name;
                        
                        var dob = document.getElementById('person-dob');
                        dob.value = person.dob;
                    };
                }(people.people[i]));

                spanName.appendChild(aName);
                
                aLink.classList.add("navigate-right");
                aLink.classList.add("pull-right");
                
                aLink.href = "gifts.html?id=" + people.people[i].id;
                
                spanDate.classList.add("dob");
                spanDate.textContent = people.people[i].dob;
                aLink.appendChild(spanDate);
                
                tablecell.appendChild(spanName);
                tablecell.appendChild(aLink);
                container.appendChild(tablecell);
            }   
        }
    },
    fillIdeas: function (ev) {
        var container = document.getElementById('idea-list');
        container.innerHTML = "";
        
        var people = _localStorage.load();
        // Look for the ID
        var person = ev.detail.state.url.split('id=')[1] || null;
        
        // Don't loop if it's empty
        if (people.people.length > 0 || person == null) {
            for (var i = 0; i < people.people.length; i++) {
                if (people.people[i].id == person) {
                    person = people.people[i];
                }
            }
        }
        
        var mainTitle;
        if (person.name.split(' ').length > 1) {
            mainTitle = "Ideas for " + person.name.split(' ')[0];
        } else {
            mainTitle = "Ideas for " + person.name;
        }
        
        var title = document.getElementsByClassName('title')[0];
        
        title.textContent = mainTitle;
        
        for (var i = 0; i < person.ideas.length; i++) {
            // Check if there's even info to go through
            if (person.ideas[i].idea && person.ideas[i].idea != "" || person.ideas[i].at && person.ideas[i].at != "" || person.ideas[i].cost && person.ideas[i].cost != "" || person.ideas[i].url && person.ideas[i].url != "") {
             
                           var ideaContainer = document.createElement('LI');
            ideaContainer.classList.add('table-view-cell');
            ideaContainer.classList.add('media');
            
            var deleteIcon = document.createElement('SPAN');
            deleteIcon.classList.add('pull-right');
            deleteIcon.classList.add('icon');
            deleteIcon.classList.add('icon-trash');
            deleteIcon.classList.add('midline');
            
            var mediaBody = document.createElement('DIV');
            mediaBody.classList.add('media-body');
            
            if (person.ideas[i].idea && person.ideas[i].idea != "") {
                var label = document.createElement('P');
                
                label.textContent = person.ideas[i].idea;
                mediaBody.appendChild(label);
            }
            if (person.ideas[i].at && person.ideas[i].at != "") {
                var location = document.createElement('P');
                
                location.textContent = person.ideas[i].at;
                mediaBody.appendChild(location);
            }
            if (person.ideas[i].cost && person.ideas[i].cost != "") {
                var cost = document.createElement('P');
                
                cost.textContent = person.ideas[i].cost;
                mediaBody.appendChild(cost);
            }
            if (person.ideas[i].url && person.ideas[i].url != "") {
                var url = document.createElement('A');
                
                url.textContent = person.ideas[i].url;
                url.href = person.ideas[i].url;
                mediaBody.appendChild(url);
            }
            
            ideaContainer.appendChild(deleteIcon);
            ideaContainer.appendChild(mediaBody);
            container.appendChild(ideaContainer);
                
            }

        }
        
    },
    pageChanged: function (ev) {
        // I'm letting it default to main here
        _pages.changePage(ev);
    },
    addPerson: function (ev) {
        
    },
    addIdea: function (ev) {
        
    },
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        
        window.addEventListener('push', _pages.changePage);
        app.showHome();
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);

        console.log('Received Event: ' + id);
    }
};


app.initialize();