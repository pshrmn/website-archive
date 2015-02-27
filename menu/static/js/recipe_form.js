document.getElementById("search_form").addEventListener("submit", searchSubmit, false);

/**************
Ingredient lookup
**************/
function searchSubmit(event){
    event.preventDefault();
    var form = document.getElementById("search_form");
    var url = form.action;
    var data = {
        "q": document.getElementById("q").value,
        "i": document.getElementById("i").value
    };
    var csrf = form.querySelector("input[name=csrfmiddlewaretoken]").value;
    post(url, JSON.stringify(data), csrf, showRecipeOptions);
}

function post(url, data, csrf, callback){
    var req = new XMLHttpRequest();
    req.onload = callback;
    req.open("POST", url, true);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.setRequestHeader("X-CSRFToken", csrf);
    req.send(data);
}

function showRecipeOptions(){
    var data = JSON.parse(this.responseText);

    var result_len = data.results.length;
    var hostname_link = document.createElement("a");
    var name;
    var html;
    if ( result_len > 0 ) {
        var rs = document.getElementById("recipe_selector");
        rs.innerHTML = "";
        for( var r = 0; r < result_len; r++ ) {
            // extend the results object
            var href = data.results[r].href;
            hostname_link.href = data.results[r].href;
            var name = hostname_link.hostname;
            var ingredients = data.results[r].ingredients.split(", ").map(function(ingredient){
                return "<li>" + ingredient + "</li>";
            }).join("");
            var title = data.results[r].title.replace(/\&amp;/g, "&");

            var div = document.createElement("div");
            div.classList.add("recipe_choice");
            div.innerHTML = '<p class="name"><a href="' + href + '" target="_blank" title="' + href + '">' + title + '</a></p>' +
            '<p class="link">from <a href="' + href +'}" target="_blank" title="' + href + '">' + name + '</a></p>' +
            '<p>Ingredients</p>' +
                '<ul>' + ingredients + '</ul>'
            var selector = document.createElement("p")
            selector.classList.add("selector");
            selector.dataset["href"] = href;
            selector.dataset["title"] = title;
            selector.textContent = "Select";
            selector.addEventListener("click", selectRecipe, false);
            div.appendChild(selector);
            rs.appendChild(div);
        }
    } else {
        document.getElementById("recipe_selector").innerHTML = "<p>No results returned, try refining your search</p>";
    }
}

/**************
Select recipe
**************/
var selected = false;
function selectRecipe(event){
    parent = getParent(this, "recipe_choice");
    if ( !parent ) {
        return;
    }
    var choices = [].slice.call(document.querySelectorAll(".recipe_choice"));
    var name = document.getElementById("id_name");
    var url = document.getElementById("id_url");
    var button = document.querySelector("#recipe_form button");
    var form = document.getElementById("recipe_form");
    if ( !selected ){
        // hide the others
        choices.forEach(function(choice){
            if ( choice !== parent ) {
                choice.classList.add("hidden");
            }
        });
        name.value = this.dataset["title"];
        url.value = this.dataset["href"];
        button.removeAttribute("disabled");
        this.textContent = "Deselect";
    } else {
        choices.forEach(function(choice){
            choice.classList.remove("hidden");
        });
        name.value = "";
        url.value = "";
        button.setAttribute("disabled", "disabled");
        this.textContent = "Select";
    }
    fadeIfEmpty();
    selected = !selected;
}

function getParent(ele, className){
    while ( ele != null ){
        ele = ele.parentElement;
        if ( ele.classList.contains(className) ) {
            return ele;
        }
    }
    return undefined;
}

function fadeIfEmpty(){
    var rf = document.getElementById("recipe_form");
    var empty = [].slice.call(rf.querySelectorAll("input[type='text']")).every(function(input){
        return input.value == "";
    });
    rf.style.opacity = empty ? 0.5 : 1;
}
fadeIfEmpty();

(function fadeOnFocus(){
    var rf = document.getElementById("recipe_form");
    [].slice.call(rf.querySelectorAll("input")).forEach(function(input){
        input.addEventListener("focus", function(){
            rf.style.opacity = 1;
        }, false);
        input.addEventListener("blur", function(){
            fadeIfEmpty();
        }, false);
    });
})();
