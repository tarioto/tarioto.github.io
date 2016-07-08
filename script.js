//create a list of pokemon to choose from
function pokeList1() {
    var dataList = document.getElementById("pokemon1");//create a data list
    var input = document.getElementById("poke1");//makes a searchbar populated by a data list
    var request = new XMLHttpRequest();//make a XMLHttpRequest to grab the pokeapi data
    request.onreadystatechange = function(response) {//check if the api request is working corectly
        if (request.readyState === 4) {
            if (request.status === 200) {
                var jsonP = JSON.parse(request.responseText);//parse the reqest into a JSON object
                var results = jsonP.results; //make the JSON object shorter

                each(results, function(element, i) {
                    var option = document.createElement("option");//populates the data list
                    option.value = results[i].name; //each option is a pokemon name
                    dataList.appendChild(option);

                });
                input.placeholder = "type your pokemon"; //once all pokemon are loaded displays different text so you know it is done
            } else {
                input.placeholder = "Couldn't load pokemon :("; //if the pokemon don't load
            }
        }
    };
    input.placeholder = "Loading pokemon..."; //while pokemon load in the data list

    request.open("GET", "https://pokeapi.co/api/v2/pokemon/?limit=811", true); //use the GET call to go to the list of pokemon from the api
    request.send(); //send XMLHttpRequest
}

function pokeList2() { //same as pokeList1 but for the other persons pokemon
    var dataList = document.getElementById("pokemon2");
    var input = document.getElementById("poke2");
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(response) {
        if (request.readyState === 4) {
            if (request.status === 200) {
                var jsonP = JSON.parse(request.responseText);
                var results = jsonP.results;

                each(results, function(element, i) {
                    var option = document.createElement("option");
                    option.value = results[i].name;
                    dataList.appendChild(option);
                });
                input.placeholder = "type their pokemon";
            } else {
                input.placeholder = "Couldn't load pokemon :(";
            }
        }
    };
    input.placeholder = "Loading pokemon...";

    request.open("GET", "https://pokeapi.co/api/v2/pokemon/?limit=811", true);
    request.send();
}

function pkmn(number) {//display pokemon name type picture create a chart and populate strengths and weaknesses
    var poke = document.getElementById("poke" + number).value.toLowerCase();
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            pokeInfo(request.responseText);
        }
    };
    request.open("GET", "https://pokeapi.co/api/v2/pokemon/" + poke, true);
    request.send();

    function pokeInfo(response) {//display name type picture from the api request to html
        var obj = JSON.parse(response);
        document.getElementById("name" + number).innerHTML = capitalizeFirstLetter(obj.name);

        if (obj.types.length === 1) {
            document.getElementById("type" + number).innerHTML = capitalizeFirstLetter(obj.types[0].type.name);
        } else {
            document.getElementById("type" + number).innerHTML = capitalizeFirstLetter(obj.types[1].type.name) + " " + capitalizeFirstLetter(obj.types[0].type.name);
        }
        if (obj.sprites.front_default === null) {
            document.getElementById("sprite" + number).innerHTML = "<img src=Images/Pokeball_icon.png>";
        } else {
            document.getElementById("sprite" + number).innerHTML = "<img src=" + obj.sprites.front_default + ">";
        }
        chart(obj, number);//create chart from pokemon obj
        strengthsWeaknesses(number);//create table from pokemon obj
    }
}

function chart(obj, number) {//create chart from pokemon obj
    var canvas = document.getElementById("can" + number);//create html canvas for chart
    var ctx = canvas.getContext("2d");

    var stats = convertStatsToArray(obj);//make numbered stats array
    var names = nameStats(obj);//make array of stat strings
    var width = 15;//making canvas dimensions
    var x = 8;
    var base = 100;

    ctx.fillStyle = typeGrad(number);//make the canvas have a gradient that matchs pokemon type color
    ctx.clearRect(0, 0, canvas.width, canvas.height);//for multiple reuests so the graph clears itslef
    each(stats, function(stat, i) {//create each bar the the bar graph to match pokemon stat numbers
        var h = stats[i];
        ctx.fillRect(x, canvas.height - h, width, h);
        x += width + 10;
    });
    document.getElementById("statNames" + number).innerHTML = "";//clear stats table
    each(names, function(name, i) {//creat table that has stat names and numbers for pokemon
        document.getElementById("statNames" + number).innerHTML +=
            "<tr>" +
            "<td>" + names[i] + "</td>" +
            "<td>" + stats[i] + "</td>" +
            "</tr>";
    });
}

function convertStatsToArray(obj) {//take pokemon object to make a list of each stat as an aray of numbers
    return map(obj.stats, function(element, i) {
        return obj.stats[i].base_stat;
    });
}

function nameStats(obj) {//take a pokemon object to make a list of the name of each stat
    return map(obj.stats, function(element, i) {
        return obj.stats[i].stat.name;
    });
}

function typeGrad(number) {//make a gradient graph to match the pokemons type color
    var canvas = document.getElementById("can" + number);
    var ctx = canvas.getContext("2d");
    var gradient = ctx.createLinearGradient(0, 0, 150, 0);

    var types = document.getElementById("type" + number).innerHTML.split(" ");
    var color1 = typeColor(types[0]);
    var color2 = typeColor(types[1]);

    if (types.length === 2) {
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
    } else {
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color1);
    }

    ctx.fillStyle = gradient;



}

function typeColor(type) {//take a string of a pokemon type and change it to a type color
    switch (type) {
        case "Normal":
            return "#A4ACAF";

        case "Fighting":
            return "#D56723";

        case "Flying":
            return "#BDB9B8";

        case "Poison":
            return "#b97fc9";

        case "Ground":
            return "#ab9842";

        case "Rock":
            return "#a38c21";

        case "Bug":
            return "#729F3F";

        case "Ghost":
            return "#7b62a3";

        case "Steel":
            return "#9EB7B8";

        case "Fire":
            return "#fd7d36";

        case "Water":
            return "#4592c4";

        case "Grass":
            return "#9bcc50";

        case "Electric":
            return "#eed53e";

        case "Psychic":
            return "#f366b9";

        case "Ice":
            return "#51C4E7";

        case "Dragon":
            return "#f16e57";

        case "Dark":
            return "#707070";

        case "Fairy":
            return "#fdb9e9";

        default:
            return "#000000";

    }
}

function strengthsWeaknesses(number) {//create table of pokemons strengths and weaknesses
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            damageTable(request.responseText);
        }
    };
    var type = deCapitalizeFirstLetter(document.getElementById("type" + number).innerHTML.split(" ")[0]);
    request.open("GET", "https://pokeapi.co/api/v2/type/" + type, true);
    request.send();

    function damageTable(response) {//use pokemon type object to create a table of strengths and weaknesses
        var obj = JSON.parse(response);

        var dDf = mapDamage(obj.damage_relations.double_damage_from);
        var hDt = mapDamage(obj.damage_relations.half_damage_to);
        var nDt = mapDamage(obj.damage_relations.no_damage_to);

        var dDt = mapDamage(obj.damage_relations.double_damage_to);
        var hDf = mapDamage(obj.damage_relations.half_damage_from);
        var nDf = mapDamage(obj.damage_relations.no_damage_from);

        var weaknesses = dDf.concat(hDt, nDt);
        var strengths = dDt.concat(hDf, nDf);// create 2 arrays of pokemon type strengths and weaknesses

        var weak = weaknesses.filter(function(element, index) {//filter out duplicates from array of weaknesses
            return weaknesses.indexOf(element) == index;
        });

        var stren = strengths.filter(function(element, index) {
            return strengths.indexOf(element) == index;
        });

        document.getElementById("strengths" + number).innerHTML =
            "<th>Strengths</th>";
        document.getElementById("weaknesses" + number).innerHTML =
            "<th>Weeknesses</th>";


        each(stren, function(element, i) {//grab array of pokemon strengths add each of them to a table
            document.getElementById("strengths" + number).innerHTML +=
                "<tr>" +
                "<td>" + capitalizeFirstLetter(stren[i]) + "</td>" +
                "</tr>";
        });


        each(weak, function(element, i) {
            document.getElementById("weaknesses" + number).innerHTML +=
                "<tr>" +
                "<td>" + capitalizeFirstLetter(weak[i]) + "</td>" +
                "</tr>";
        });
    }
}

function capitalizeFirstLetter(string) {//capitalize the first letter of a string
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function deCapitalizeFirstLetter(string) {//un capitalize the first letter of a string
    return string.charAt(0).toLowerCase() + string.slice(1);
}

function mapDamage(obj) {//transforming a pokemon object to just an array of the pokemons damage names
    return map(obj, function(element, i) {
        return obj[i].name;
    });
}

function each(coll, f) {//iteration over an array or object
    if (Array.isArray(coll)) {
        for (var i = 0; i < coll.length; i++) {
            f(coll[i], i);
        }
    } else {
        for (var key in coll) {
            f(coll[key], key);
        }
    }
}

function map(coll, f) {//for transforming arrays to new arrays or objects
    var acc = [];
    if (!Array.isArray(coll)) {
        acc = {};
    }
    each(coll, function(element, key) {
        acc[key] = f(element, key);
    });
    return acc;
}
