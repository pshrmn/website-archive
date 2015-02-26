// override search with ajax call
(function(){

    var selected = false,
        page = 1;

    jQuery(function($) {
        fadeIfEmpty();
        
        if ( window.localStorage ) {
            var now = (new Date()).valueOf();
            if ( localStorage['cache_expires'] && 
                    parseInt(localStorage['cache_expires'], 10) < now) {
                localStorage.clear();
                localStorage['cache_expires'] = now + 7200000;
            } else {
                localStorage['cache_expires'] = now + 7200000;
            }
            
            $("#id_restaurant").typeahead({
                name: "restaurants",
                prefetch: "/api/restaurants"
            });
        }

        $('#recipe_form input').focus(function(){
            $('#recipe_form').css('opacity', '1');
        });
        
        $("#search_form").submit(ajaxSubmit);

        $("#content")
            .on("click", ".selector", selectRecipe);

        
    });

    function ajaxSubmit(event){
        event.preventDefault();
        var form = $(this),
            action = form.prop("action"),
            info = form.serialize();
        
        $.ajax({
            type: "POST",
            url: action,
            data: info,
            success: function(data){
                recipe_global = data.results;
                selected = false;
                showRecipeOptions(data);
            },
            dataType: "json"
        });
    }

    function selectRecipe(){
        var _this = $(this),
        parent = _this.parents(".recipe_choice");
        if ( !selected ){
            // hide the others
            parent.siblings().hide();
            $("#id_name").val(_this.data("title"));
            $("#id_url").val(_this.data("href"));
            $("#recipe_form button").removeProp("disabled");
            _this.text("Deselect");
            $("#recipe_form").css("opacity", "1");
        } else {
            parent.siblings().show();
            $("#id_name").val("");
            $("#id_url").val("");
            $("#recipe_form button").prop("disabled","disabled");
            _this.text("Select");
            fadeIfEmpty();
        }
        selected = !selected;
    }

    function fadeIfEmpty(){
        var rf = $("#recipe_form"),
            inputs = $("input[type='text']", rf),
            empty = true;
        inputs.each(function(){
            if( $(this).val() !== "" ) {
                empty = false
            }
        })
        if ( empty ) {
            rf.css("opacity", "0.5");
        }
    }

    function showRecipeOptions(opts){
        var result_len = opts.results.length,
            hostname_link = document.createElement("a"),
            name,
            html;
        if ( result_len > 0 ) {
            for( var r = 0; r < result_len; r++ ) {
                // extend the results object
                hostname_link.href = opts.results[r].href;
                opts.results[r].name = hostname_link.hostname;
                opts.results[r].ingredients = opts.results[r].ingredients.split(", ");
                opts.results[r].title = opts.results[r].title.replace(/\&amp;/g, "&");
            }
        }
        template = Handlebars.templates.options;
        html = template(opts);
        $("#recipe_selector").html(html);
    }


})();