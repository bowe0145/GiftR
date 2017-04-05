/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var CurrentPerson = null;
/**
  *
  * HELPERS
  *
  **/
// Returns TRUE if empty or null
var isNullorEmpty = function (object) {
    if (!object || object == "") {
        return true;
    } else {
        return false;
    }
}


/**
  *
  * PAGES
  *
  **/
var _pages = {};

_pages.changePage = function (ev) {
    let page = ev.detail.state.url.indexOf('gifts') == -1 ? "main" : "gifts";
    
    switch (page) {
        case "main":
            // Go to the main page
            app.showHome(ev);
            break;
        case "gifts":
            // Go to the gifts page
            app.showGifts(CurrentPerson);
            break;
    }
}

_pages.savePerson = function () {
    var name = document.getElementById('person-name').value;
    var dob = document.getElementById('person-dob').value;

    // I think it looks better nested... Anyways, the person should have a name and a dob.
    if (!isNullorEmpty(name)) {
        if (!isNullorEmpty(dob)) {
            // Super lazy id generation
            var person = {"dob": dob, "id": Math.floor((Math.random() * 100000000) + 1), "ideas": [], "name": name}

            _localStorage.savePerson(person);
        }
    }

    // Reset the modal
    var xButton = document.getElementById('person-x');
        var clickEvt = new MouseEvent('touchend', {
        'view': window,
        'bubbles': true,
        'cancelable': true
        });

        xButton.dispatchEvent(clickEvt); 

    // Remove the listener
    this.removeEventListener('touchstart', this);
    
    app.showHome();
};

_pages.editPerson = function () {
    var name = document.getElementById('person-name').value;
    var dob = document.getElementById('person-dob').value;

    // I think it looks better nested... Anyways, the person should have a name and a dob.
    if (!isNullorEmpty(name) && !isNullorEmpty(dob)) {
        // Super lazy id generation
        var person = {"dob": dob, "id": Math.floor((Math.random() * 100000000) + 1), "ideas": [], "name": name}

        _localStorage.updatePerson(person);
    }
    
    this.removeEventListener('touchstart', this);
    
    var xButton = document.getElementById('person-x');
    var clickEvt = new MouseEvent('touchend', {
    'view': window,
    'bubbles': true,
    'cancelable': true
    });

    xButton.dispatchEvent(clickEvt);
    
    app.showHome();
}

_pages.closePerson = function () {
    // Reset the form
    document.getElementById('person-name').value = "";
    document.getElementById('person-dob').value = "";
    document.getElementById('person-title').textContent = "Add a Person";
    
    // Remove the event listener
    this.removeEventListener('touchstart', this);
    
    // Don't need to do this if it's the x button
    if (this.id != "person-x") {
        var xButton = document.getElementById('person-x');
        var clickEvt = new MouseEvent('touchend', {
        'view': window,
        'bubbles': true,
        'cancelable': true
        });

        xButton.dispatchEvent(clickEvt);   
    }
    
    // Refresh the page
    app.showHome();
};

_pages.saveIdea = function () {
    var label = document.getElementById('gift-label');
    var location = document.getElementById('gift-location');
    var url = document.getElementById('gift-url');
    var cost = document.getElementById('gift-cost');
    
    // Get the data
    
    // Start by checking if everything is null/empty
    if (isNullorEmpty(label.value) && isNullorEmpty(location.value) && isNullorEmpty(url.value) && isNullorEmpty(cost.value)) {
        // Everything is empty
    } else {
        // Build the object to save
        var id = Math.floor((Math.random() * 100000000) + 1)
        var idea = {"at": location.value, "cost": cost.value,"giftid": id,"idea": label.value,"url": url.value};
        // dont ask T_T
        _localStorage.saveIdea(idea, idea);
    }
    
    // Cleanup
    label.value = "";
    location.value = "";
    url.value = "";
    cost.value = "";
    
    this.removeEventListener('touchstart', this);
    
    var xButton = document.getElementById('gift-x');
    var clickEvt = new MouseEvent('touchend', {
    'view': window,
    'bubbles': true,
    'cancelable': true
    });

    xButton.dispatchEvent(clickEvt);   
    
    app.fillIdeas();
};

_pages.closeIdea = function (ev) {
    return function () {
        var label = document.getElementById('gift-label');
        var location = document.getElementById('gift-location');
        var url = document.getElementById('gift-url');
        var cost = document.getElementById('gift-cost');

        label.value = "";
        location.value = "";
        url.value = "";
        cost.value = "";

        this.removeEventListener('touchstart', this);
        
        
        // Don't need to do this if it's the x button
        if (this.id != "gift-x") {
            var xButton = document.getElementById('gift-x');
            var clickEvt = new MouseEvent('touchend', {
            'view': window,
            'bubbles': true,
            'cancelable': true
            });

            xButton.dispatchEvent(clickEvt);   
        }

        app.showGifts();  
    };
};


/**
  *
  * LOCAL STORAGE
  *
  **/

var _localStorage = {
    key: 'giftr-bowe0145',
    load: function () {
        // Load the JSON from localstorage
        var item = localStorage.getItem(_localStorage.key);
        // It didn't want to parse it so I just kept telling it to parse
        item = JSON.parse(item);
        // Return the item to be used as json
        return item;
    },
    getByID: function (id) {
        var people = _localStorage.load();
        var person = null;
        
        for (var i = 0; i < people.people.length; i++) {
            if (people.people[i].id == id) {
                person = people.people[i];
            }
        }
        
        return person == null ? false : person;
    },
    save: function (item) {
        // Save it to storage
        console.log("Saving: " + JSON.stringify(item));
        localStorage.setItem(_localStorage.key, JSON.stringify(item));
    },
    savePerson: function (person) {
        // Returns json
        if (!isNullorEmpty(person)) {
            var temp = _localStorage.load();

            temp.people.push(person);

            _localStorage.save(temp);
        }
    },
    updatePerson: function (person) {
        // Load the array
        var temp = _localStorage.load();
        // Load the old person
        var oldPerson = _localStorage.getByID(CurrentPerson);
        
        oldPerson.name = person.name;
        oldPerson.dob = person.dob;
        
        console.log(oldPerson);
        console.log(person);
        
        for (var i = 0; i < temp.people.length; i++) {
            if (temp.people[i].id == oldPerson.id) {
                temp.people[i].name = person.name;
                temp.people[i].dob = person.dob;
            }
        }
        
        _localStorage.save(temp);
    },
    saveIdea: function (person, idea) {
        var temp = _localStorage.load();
        
        for (var i = 0 ; i < temp.people.length; i++) {
            if (temp.people[i].id == CurrentPerson) {
                temp.people[i].ideas.push(idea);
            }
        }
        
        _localStorage.save(temp);
    },
    deleteIdea: function (person, idea) {
        var temp = _localStorage.load();
        
        for (var i = 0; i < temp.people.length; i++) {
            // Loop through every person
            if (temp.people[i].id == person.id) {
                // Found the person
                // Reset the array to nothing
                person.ideas = [];
                for (j = 0; j < temp.people[i].ideas.length; j++) {
                    if (temp.people[i].ideas[j].giftid != idea.giftid) {
                        person.ideas.push(temp.people[i].ideas[j]);
                    }
                }
                
                temp.people[i] = person;
            }
        }
        
        
        
        _localStorage.save(temp);
    }
}

/**
  *
  * APP
  *
  **/

var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.addEventListener('DOMContentLoaded', this.domContentLoaded.bind(this), false);
    },
    showHome: function (ev) {
        
        // Get the elements
        var personX = document.getElementById('person-x');
        var personClose = document.getElementById('person-close');
        var personSave = document.getElementById('person-save');

        // Listeners
        personClose.addEventListener('touchstart', _pages.closePerson);
        personX.addEventListener('touchstart', _pages.closePerson);
        personSave.addEventListener('touchstart', _pages.savePerson);
        
        // Fill the page
        app.fillPeople();
    },
    showGifts: function (ev) {
        // Get the elements
        var giftX = document.getElementById('gift-x');
        var giftClose = document.getElementById('gift-close');
        var giftSave = document.getElementById('gift-save');
        
        // Listeners
        giftClose.addEventListener('touchstart',_pages.closeIdea);
        giftX.addEventListener('touchstart', _pages.closeIdea);
        giftSave.addEventListener('touchstart',_pages.saveIdea);
        
        // Fill the page
        app.fillIdeas();
    },
    fillPeople: function () {
        // The list container
        var container = document.getElementById('contact-list');
        container.innerHTML = "";
        // Load the json from localstorage
        var people = _localStorage.load().people;
        
        // If there's no localstorage then don't bother looping
        if (!isNullorEmpty(people) || people.length > 0) {
            // Loop through each person
            for (var i = 0;i < people.length; i++) {
                var tablecell = document.createElement("LI");
                var spanName = document.createElement("SPAN");
                var aName = document.createElement("A");
                var aLink = document.createElement("A");
                var spanDate = document.createElement("SPAN");
                
                tablecell.classList.add("table-view-cell");
                tablecell.dataset.id = people[i].id;
                
                spanName.classList.add("name");
                spanName.addEventListener('touchstart', function (id) {
                    return function () {
                        CurrentPerson = id;
                        app.editPerson();
                    }
                }(people[i].id), true);
                aName.href = "#personModal";
                aName.textContent = people[i].name;

                spanName.appendChild(aName);
                
                aLink.classList.add("navigate-right");
                aLink.classList.add("pull-right");
                
                spanDate.classList.add("dob");
                spanDate.textContent = people[i].dob;
                aLink.appendChild(spanDate);
                aLink.href = "gifts.html";
                aLink.addEventListener('touchstart', function (id) {
                    return function () {
                        CurrentPerson = id;
                    }
                }(people[i].id), false)
                
                tablecell.appendChild(spanName);
                tablecell.appendChild(aLink);
                container.appendChild(tablecell);
            }   
        }
    },
    fillIdeas: function () {
        console.log("fill ideas");
        var container = document.getElementById('idea-list');
        container.innerHTML = "";

        // Look for the ID
        var person = CurrentPerson;

        var person = _localStorage.getByID(person);
        if (!isNullorEmpty(person)) {
         
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
            if (!isNullorEmpty(person.ideas[i].idea) || !isNullorEmpty(person.ideas[i].at) || !isNullorEmpty(person.ideas[i].cost) || isNullorEmpty(person.ideas[i].url)) {
             
            var ideaContainer = document.createElement('LI');
            ideaContainer.classList.add('table-view-cell');
            ideaContainer.classList.add('media');
            
            var deleteIcon = document.createElement('SPAN');
            deleteIcon.classList.add('pull-right');
            deleteIcon.classList.add('icon');
            deleteIcon.classList.add('icon-trash');
            deleteIcon.classList.add('midline');
            deleteIcon.addEventListener('touchstart', function (person, id) {
                return function () {
                    _localStorage.deleteIdea(person, id);
                    app.fillIdeas();
                }
            }(person, person.ideas[i]));
            
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
        }
        
    },
    pageChanged: function (ev) {
        // I'm letting it default to main here
        _pages.changePage(ev);
    },
    editPerson: function () {
        var name = document.getElementById('person-name');
        var dob = document.getElementById('person-dob');
        var title = document.getElementById('person-title');
        
        var person = _localStorage.getByID(CurrentPerson);
        
        name.value = person.name;
        dob.value = person.dob;
        title.textContent = "Edit " + person.name;
        
        var saveButton = document.getElementById('person-save');
        saveButton.removeEventListener('touchstart', _pages.savePerson);
        
        saveButton.addEventListener('touchstart', _pages.editPerson);
    },
    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
        
        window.addEventListener('push', app.pageChanged);
        app.showHome();
    },
    domContentLoaded: function () {
        window.addEventListener('push', app.pageChanged);
        app.showHome();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);

        console.log('Received Event: ' + id);
    }
};

app.initialize();