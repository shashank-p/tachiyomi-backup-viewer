document.getElementById('import').onclick = function () {
    var files = document.getElementById('selectFiles').files;
    //var filename = files[0].name;
    var dateTime = files[0].name.substring(10, 20) + " " + files[0].name.substring(21, 26);
    document.getElementById('datetime').value = dateTime;

    if (files.length <= 0) {
        return false;
    }

    var fr = new FileReader();

    fr.onload = function (e) {
        var result = JSON.parse(e.target.result);
        var formatted = JSON.stringify(result, null, 2);
        //console.log(result);
        document.getElementById('result').value = e.target.result;
        myFunction();
    }

    fr.readAsText(files.item(0));

};

function myFunction() {

    var txt = document.getElementById("result").value;
    var backUpDate = document.getElementById("datetime").value;
    var obj = JSON.parse(txt);
    var displayData = "";
    var allCategoriesListData = "";
    var allExtensionsListData = "";
    var mangaListData = "";
    var categoriesListData = "";
    var trackersListData = "";
    var sourceLink = "";

    //Display Version Number
    displayData += "Backup DateTime " + "<small>" + "(YYYY-MM-DD HH-MM) : " + "</small><br/>" + backUpDate + "<br/>" + "<br/>";
    //*************************************************************
    //Display Version Number
    displayData += "Version : " + "<br/>" + obj.version + "<br/>" + "<br/>";
    //*************************************************************
    if (typeof obj.categories != "undefined") {
        //To Get All Category List
        for (var c = 0; c < obj.categories.length; c++) {
            allCategoriesListData += c + 1 + ". " + obj.categories[c][0] + "<br/>";
        }
    } else {
        allCategoriesListData = "Not Available";
    }

    //Display All Categories
    displayData += "All Categories (" + (typeof obj.categories != "undefined" ? obj.categories.length : 0) + ") : <br/>" + allCategoriesListData + "<br/>";
    allCategoriesListData = "";
    //*************************************************************
    if (typeof obj.extensions != "undefined") {
        //To Get All Extensions List
        for (var e = 0; e < obj.extensions.length; e++) {
            obj.extensions[e] = obj.extensions[e].split(":");
            allExtensionsListData += e + 1 + ". " + obj.extensions[e][1] + "<br/>";
        }
    } else {
        allExtensionsListData = "Not Available";
    }

    //Display All Extensions
    displayData += "Extensions (" + (typeof obj.extensions != "undefined" ? obj.extensions.length : 0) + ") : <br/>" + allExtensionsListData + "<br/>";
    allExtensionsListData = "";
    //*************************************************************
    displayData += "Manga (" + obj.mangas.length + ") : <br/><br/>";
    //To Get All Manga List 
    for (var i = 0; i < obj.mangas.length; i++) {
        var AllMangas = obj.mangas[i];

        for (var j = 0; j < AllMangas.manga.length; j++) {
            var mangaKeyTitles = "";

            switch (j) {
                case 0:
                    mangaListData = i + 1 + ". ";
                    /* mangaKeyTitles = "URL : ";          
                    mangaListData = mangaKeyTitles + AllMangas.manga[j]; */
                    break;
                case 1:
                    mangaKeyTitles = "Title : ";
                    mangaListData = mangaKeyTitles + AllMangas.manga[j];
                    break;
                case 2:
                    mangaKeyTitles = "Source : ";
                    for (var je = 0; je < obj.extensions.length; je++) {
                        if (AllMangas.manga[j] == obj.extensions[je][0]) {
                            mangaListData = mangaKeyTitles + obj.extensions[je][1];
                        }
                    }
                    break;
                case 3:
                    mangaKeyTitles = "N/A : ";
                    mangaListData = mangaKeyTitles + AllMangas.manga[j];
                    break;
                case 4:
                    mangaKeyTitles = "N/A : ";
                    mangaListData = mangaKeyTitles + AllMangas.manga[j];
                    break;
                default:
                    break;
            }
            //Display Manga Details
            displayData += mangaListData + "<br/>";
            mangaListData = "";
        }
        //*****************************************************************
        //To get Chapters Count of Manga and Display Chapters Count Details
        displayData += "Chapters Read: " + (typeof AllMangas.chapters != "undefined" ? AllMangas.chapters.length : 0) + "<br/>";
        //*****************************************************************
        //To get Category list of Manga
        for (var k = 0; k < AllMangas.categories.length; k++) {
            categoriesListData += AllMangas.categories[k] + ", ";
        }
        //Display Categories Details
        displayData += "Categories : " + categoriesListData.replace(/,\s*$/, "") + "<br/>";
        categoriesListData = "";
        //*****************************************************************
        if (typeof AllMangas.track != "undefined") {
            //To get Tracker list of Manga
            for (var l = 0; l < AllMangas.track.length; l++) {
                const trackersList =
                    (AllMangas.track[l].u.includes("myanimelist") ? "<a href=" + AllMangas.track[l].u + " target='_blank'>Myanimelist</a>" : "") ||
                    (AllMangas.track[l].u.includes("anilist") ? "<a href=" + AllMangas.track[l].u + " target='_blank'>Anilist</a>" : "") ||
                    (AllMangas.track[l].u.includes("kitsu") ? "<a href=" + AllMangas.track[l].u + " target='_blank'>Kitsu</a>" : "");

                //List of All trackers for Particular Manga          
                trackersListData += trackersList + ", ";
            }
        } else {
            const trackersList = "Not Available";
            trackersListData += trackersList;
        }

        //Display Tracker Details
        displayData += "Trackers : " + trackersListData.replace(/,\s*$/, "") + "<br/><br/>";
        trackersListData = "";
    }
    //*************************************************************
    //Merge All Data
    document.getElementById("tachiyomiBackupDisplay").innerHTML = displayData;
    //*************************************************************   
}
