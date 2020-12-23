function getExtensionSourceName(srcList) {
    srcList = srcList.split(":");

    var jsonSourceList = $.ajax({
        url: 'https://gist.githubusercontent.com/shashank-p/39b5d5ea9aeb523b7d3a97451d838f9d/raw/91828fc5dd6d716e04aea6ab22e0aebe8dc9f5d2/tachiyomi-source-details.json',
        async: false
    }).responseText;

    var sortedSourceList = JSON.parse(jsonSourceList);
    for (var i = 0; i < sortedSourceList.extensions.length; i++) {
        var counter = sortedSourceList.extensions[i];
        if (counter.id == srcList[0] && srcList[1]) {
            return (counter.source + ' (' + counter.lang + ')');
        } else if (counter.id == srcList[0] && !srcList[1]) {
            return (counter.source + ' (' + counter.lang + ') Missing');
        }
    }
}

document.getElementById('import').onclick = function () {
    var files = document.getElementById('selectFiles').files;

    if (files.length <= 0) {
        alert("Please Select Json Backup File");
        return false;
    }

    var dateTime = files[0].name.length > 26 ? files[0].name.substring(10, 20) + " " + (files[0].name.substring(21, 26)).replace("-", ":") : 'Not Available';
    document.getElementById('datetime').value = dateTime;

    var fr = new FileReader();

    fr.onload = function (e) {
        var result = JSON.parse(e.target.result);
        var formatted = JSON.stringify(result, null, 2);
        //console.log(result);
        document.getElementById('result').value = e.target.result;
        processJsonData();
    }

    fr.readAsText(files.item(0));

};

function switchTheme() {
    var element = document.body;
    //console.log(element.classList.length)
    element.classList.toggle("dark-mode");

    var elems = document.querySelectorAll(".myClass");
    if (!element.classList.length) {
        for (var i = 0; i < elems.length; i++) {
            var cardElement = document.getElementById("data-card-" + i);
            cardElement.classList.remove("bg-dark");
        }
    } else {
        for (var i = 0; i < elems.length; i++) {
            var cardElement = document.getElementById("data-card-" + i);
            cardElement.classList.add("bg-dark");
        }
    }
    document.getElementById("selectFiles").focus();

}

function processJsonData() {

    var txt = document.getElementById("result").value;
    var backUpDate = document.getElementById("datetime").value;
    var obj = JSON.parse(txt);
    var displayDatetimeData = displayVersionData = displayCategoryData = displayExtensionData = displayMangaCountData = displayMangaInfoData = "";
    var allCategoriesListData = "";
    var allExtensionsListData = "";
    var mangaListData = "";
    var categoriesListData = "";
    var trackersListData = "";

    //Display Date Time
    displayDatetimeData += "<b>Backup DateTime :</b>" + "<br/<small><i>" + "(YYYY-MM-DD HH-MM) </i> " + "</small><br/>" + backUpDate + "<br/>" + "<br/>";
    //*************************************************************
    //Display Version Number
    displayVersionData += "<b>Version : </b>" + "<br/>" + obj.version + "<br/>" + "<br/>";
    //*************************************************************
    if (typeof obj.categories != "undefined") {
        //Check if there's any manga without user defined category then it's Default category
        for (var cd = 0; cd < obj.mangas.length; cd++) {
            if (typeof obj.mangas[cd].categories == "undefined") {
                allCategoriesListData = "0. Default" + "<br/>";
            }
        }

        //If there's blank category then it is Default category
        if (obj.categories.length == 0) {
            allCategoriesListData = "1. Default" + "<br/>";
        }

        //To Get All Category List
        for (var c = 0; c < obj.categories.length; c++) {
            allCategoriesListData += (c + 1) + ". " + obj.categories[c][0] + "<br/>";
        }
    } else {
        allCategoriesListData = "No Categories Found" + "<br/>";
    }

    //Display All Categories
    displayCategoryData += "<b>Categories (" + (typeof obj.categories != "undefined" ? (obj.categories.length == 0 ? 1 : obj.categories.length) : 0) + ") : </b><br/>" + allCategoriesListData + "<br/>";
    allCategoriesListData = "";
    //*************************************************************
    if (typeof obj.extensions != "undefined") {
        if (obj.extensions.length == 0) {
            allExtensionsListData = "No Extensions Found" + "<br/>";
        }
        //To Get All Extensions List
        for (var e = 0; e < obj.extensions.length; e++) {
            srcName = getExtensionSourceName(obj.extensions[e]);
            allExtensionsListData += e + 1 + ". " + srcName + "<br/>";
        }
    } else {
        allExtensionsListData = "No Extensions Found" + "<br/>";
    }

    //Display All Extensions
    displayExtensionData += "<b>Extensions (" + (typeof obj.extensions != "undefined" ? obj.extensions.length : 0) + ") : </b><br/>" + allExtensionsListData + "<br/>";
    allExtensionsListData = "";
    //*************************************************************
    displayMangaCountData += "<b>Manga (" + obj.mangas.length + ") : </b><br/>";
    //To Get All Manga List 
    for (var i = 0; i < obj.mangas.length; i++) {
        var AllMangas = obj.mangas[i];

        for (var j = 0; j < AllMangas.manga.length; j++) {
            var mangaKeyTitles = "";

            switch (j) {
                case 0:
                    mangaListData = "<div class='col-md-4 py-2'><div class='card h-100 myClass " + (document.body.classList.length == 1 ? 'bg-dark' : '') + "' id='data-card-" + i + "'><div class='card-body'>" + (i + 1) + ". <br/>";
                    /* mangaKeyTitles = "URL : ";          
                    mangaListData = mangaKeyTitles + AllMangas.manga[j]; */
                    break;
                case 1:
                    mangaKeyTitles = "<b>Title : </b>";
                    mangaListData = mangaKeyTitles + AllMangas.manga[j] + "<br/>";
                    break;
                case 2:
                    mangaKeyTitles = "<b>Source : </b>";
                    if (typeof obj.extensions != "undefined") {
                        for (var je = 0; je < obj.extensions.length; je++) {
                            if (AllMangas.manga[j] == obj.extensions[je][0]) {
                                mangaListData = mangaKeyTitles + obj.extensions[je][1] + "<br/>";
                            }
                        }
                    } else {
                        mangaListData = mangaKeyTitles + "Obsoleted (N/A)" + "<br/>";
                    }
                    break;
            }
            //Display Manga Details
            displayMangaInfoData += mangaListData;
            mangaListData = "";
        }
        //*****************************************************************
        //To get Chapters Count of Manga and Display Chapters Count Details
        displayMangaInfoData += "<b>Chapters Read: </b>" + (typeof AllMangas.chapters != "undefined" ? AllMangas.chapters.length : 0) + "<br/>";
        //*****************************************************************
        //To get Category list of Manga
        if (typeof AllMangas.categories != "undefined") {
            for (var k = 0; k < AllMangas.categories.length; k++) {
                categoriesListData += AllMangas.categories[k] + ", ";
            }
        } else {
            categoriesListData = "Default";
        }

        //Display Categories Details
        displayMangaInfoData += "<b>Categories : </b>" + categoriesListData.replace(/,\s*$/, "") + "<br/>";
        categoriesListData = "";
        //*****************************************************************
        if (typeof AllMangas.track != "undefined") {
            //To get Tracker list of Manga
            for (var l = 0; l < AllMangas.track.length; l++) {
                const trackersList =
                    /* if not for Internet Explorer 
                    (AllMangas.track[l].u.includes("myanimelist") ? "<a href=" + AllMangas.track[l].u + " target='_blank'>Myanimelist</a>" : "") */
                    (AllMangas.track[l].u.indexOf("myanimelist") !== -1 ? "<a href=" + AllMangas.track[l].u + " target='_blank'>Myanimelist</a>" : "") ||
                    (AllMangas.track[l].u.indexOf("anilist") !== -1 ? "<a href=" + AllMangas.track[l].u + " target='_blank'>Anilist</a>" : "") ||
                    (AllMangas.track[l].u.indexOf("kitsu") !== -1 ? "<a href=" + AllMangas.track[l].u + " target='_blank'>Kitsu</a>" : "");

                //List of All trackers for Particular Manga          
                trackersListData += trackersList + ", ";
            }
        } else {
            const trackersList = "No Trackers Found";
            trackersListData += trackersList;
        }

        //Display Tracker Details
        displayMangaInfoData += "<b>Trackers : </b>" + trackersListData.replace(/,\s*$/, "") + "<br/>" + "</div></div><br/></div>";
        trackersListData = "";
    }
    //*************************************************************
    //Merge All Data
    document.getElementById("tachiyomiDatetimeDisplay").innerHTML = displayDatetimeData;
    document.getElementById("tachiyomiVersionDisplay").innerHTML = displayVersionData;
    document.getElementById("tachiyomiCategoryDisplay").innerHTML = displayCategoryData;
    document.getElementById("tachiyomiExtensionDisplay").innerHTML = displayExtensionData;
    document.getElementById("tachiyomiMangaCountDisplay").innerHTML = displayMangaCountData;
    document.getElementById("tachiyomiMangaInfoDisplay").innerHTML = displayMangaInfoData;
    //*************************************************************   
}

/*Scroll to top when arrow up clicked BEGIN*/
$(window).scroll(function () {
    var height = $(window).scrollTop();
    if (height > 100) {
        $('#back2Top').fadeIn();
    } else {
        $('#back2Top').fadeOut();
    }
});
$(document).ready(function () {
    $("#back2Top").click(function (event) {
        event.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, "slow");
        return false;
    });

});
 /*Scroll to top when arrow up clicked END*/