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
    var name;
    var html;
    if ( result_len > 0 ) {
        var rs = document.getElementById("recipe_selector");
        rs.innerHTML = "";
        var fragment = document.createDocumentFragment();
        for( var r = 0; r < result_len; r++ ) {
            var div = makeRecipe(data.results[r]);
            fragment.appendChild(div);
        }
        rs.appendChild(fragment);
    } else {
        document.getElementById("recipe_selector").textContent = "No results returned, try refining your search";
    }
}

function makeRecipe(obj){
    var href = obj.href;
    var title = obj.title.replace(/\&amp;/g, "&");

    var holder = document.createElement("div");
    holder.classList.add("recipe_choice");

    var p1 = document.createElement("p");
    p1.classList.add("name");
    var titleLink = document.createElement("a");
    titleLink.setAttribute("href", href);
    titleLink.setAttribute("title", title);
    titleLink.textContent = title;
    p1.appendChild(titleLink);
    holder.appendChild(p1);

    var p2 = document.createElement("p");
    p2.classList.add("link");
    p2.textContent = "from";
    var nameLink = document.createElement("a");
    nameLink.setAttribute("href", href);
    nameLink.setAttribute("title", title);
    nameLink.textContent = nameLink.hostname;
    p2.appendChild(nameLink);
    holder.appendChild(p2);

    var p3 = document.createElement("p");
    p3.textContent = "Ingredients";
    holder.appendChild(p3);

    var list = document.createElement("ul");
    var li;
    var ingredients = obj.ingredients.split(", ").forEach(function(ingredient){
        li = document.createElement("li");
        li.textContent = ingredient;
        list.appendChild(li);
    });
    holder.appendChild(list);
    
    var selector = document.createElement("p")
    selector.classList.add("selector");
    selector.dataset["href"] = href;
    selector.dataset["title"] = title;
    selector.textContent = "Select";
    selector.addEventListener("click", selectRecipe.bind([holder, selector]), false);
    holder.appendChild(selector);

    return holder;
}

/**************
Select recipe
**************/
var selected = false;
function selectRecipe(event){
    var parent = this[0];
    var selector = this[1];
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
        name.value = selector.dataset["title"];
        url.value = selector.dataset["href"];
        button.removeAttribute("disabled");
        selector.textContent = "Deselect";
    } else {
        choices.forEach(function(choice){
            choice.classList.remove("hidden");
        });
        name.value = "";
        url.value = "";
        button.setAttribute("disabled", "disabled");
        selector.textContent = "Select";
    }
    fadeIfEmpty();
    selected = !selected;
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
