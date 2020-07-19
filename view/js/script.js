const categories = ['Chemistry', 'Economics', 'Literature', 'Peace', 'Physics', 'Medicine', 'Multiple Nobel Laureates']

function checkYearFormat(year) {
    if(year <= 1900 || year >= 2018) {
        alert("Please enter Year between 1900 and 2018 only")
        return false
    }
    return true
}

function showDetails(category, year) {
    if(category == -1) {
        alert(`Please select a Category`)
    }
    else if(checkYearFormat(year)) {
        document.getElementById("loader-view").style.display = "block"
        const url = 'http://api.nobelprize.org/v1/prize.json'
        fetch(url)
        .then((resp) => resp.json())
        .then(function(data) {
            document.getElementById("loader-view").style.display = "none"
            var records = data.prizes;
            // console.log(records.length)
            // console.log(records)

            document.getElementById("category-selected").innerHTML = "Category: " + categories[category]
            
            if(category != "6") {
                document.getElementById("year-selected").innerHTML = "Year: " + year
                document.getElementById("prize-list").innerHTML = ""
                
                var i = 0, j, beg, end = records.length, mid, flag = 0, temp, winners
                
                // set beg as first occurence of 2017 in records
                for(i = 0; i < end; i++) {
                    if(records[i].year == "2017") {
                        beg = i
                        break
                    }
                }
                
                i = null
                // binary search
                while(beg <= end) {     
                    mid = Math.floor((beg + end) / 2)

                    if(records[mid].year == year) {
                        i = mid
                        break
                    }
                    else if(records[mid].year > year)
                        beg = mid + 1
                    else
                        end = mid - 1
                }
                
                if(i || i == 0) {
                    temp = i
                    while(!flag && i >= 0 && parseInt(records[i].year) == parseInt(year)) {
                        if(records[i].category == categories[category].toLowerCase()) {
                            flag = 1
                            break
                        }
                        i--
                    }
                    if(!flag)
                        i = temp + 1
                    while(!flag && i < records.length && parseInt(records[i].year) == parseInt(year)) {
                        if(records[i].category == categories[category].toLowerCase()) {
                            flag = 1
                            break
                        }
                        i++
                    }
                }

                if(flag) {
                    winners = records[i].laureates
                    for(j = 0; j < winners.length; j++) {
                        document.getElementById("prize-list").innerHTML += "<li class='list-item'>" + (winners[j].firstname ? winners[j].firstname : "") + " " + (winners[j].surname ? winners[j].surname : "") + "</li>"
                    }
                }
                else {
                    alert(`Nobody received the Nobel Prize in ${categories[category]} in the year ${year}.`)
                }
            }
            else {
                document.getElementById("year-selected").innerHTML = ""
                document.getElementById("year-input").value = 2017
                var obj = {}, ans = [], i, j, k = 0, m, flag = 1
                
                for(i = 0; i < records.length; i++) {
                    if(records[i].laureates == undefined)
                        continue
                    n = records[i].laureates.length
                    for(j = 0; j < parseInt(n); j++) {
                        if(parseInt(records[i].laureates[j].id) in obj) {
                            v = {
                                "id": `${records[i].laureates[j].id}`,
                                "name": `${(records[i].laureates[j].firstname) ? records[i].laureates[j].firstname + " " : ""}${(records[i].laureates[j].surname) ? records[i].laureates[j].surname + " " : ""}`
                            }
                            for(m = 0; m < ans.length; m++) {
                                if(ans[m].id == v.id) {
                                    flag = 0
                                    break
                                }
                            }
                            if(flag)
                                ans[k++] = v
                            flag = 1
                        }
                        else
                            obj[parseInt(records[i].laureates[j].id)] = 1
                    }
                }
                // console.log(ans)
                
                document.getElementById("prize-list").innerHTML = ""
                ans.forEach(element => {
                    document.getElementById("prize-list").innerHTML += "<li class='list-item'>" + element.name + "</li>"
                })
            }
        })
        .catch(function(error) {
            console.log(error);
        })
    }
}