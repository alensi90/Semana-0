const ORDER_ASC_PRICE = "-+";
const ORDER_DESC_PRICE = "+-";
const ORDER_BY_PROD_SOLD = "Cant.";
var currentProductsArray = [];
var currentSortCriteria = undefined;
var minCount = undefined;
var maxCount = undefined;

function showProductsList(){

    let htmlContentToAppend = "";
    for(let i = 0; i < currentProductsArray.length; i++){
        let productos = currentProductsArray[i];
        if (((minCount == undefined) || (minCount != undefined && parseInt(productos.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(productos.cost) <= maxCount))){
                
            htmlContentToAppend += `
            <a href="category-info.html" class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="` + productos.imgSrc + `" alt="` + productos.description + `" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">`+ productos.name +`</h4>
                            <small class="text-muted">` + productos.soldCount + ` artículos</small>
                        </div>
                        <div class="d-flex w-100 justify-content-between">    
                            <p class="mb-1">` + productos.description + `</p>
                        </div><br>    
                        <div class="d-flex w-100 justify-content-between">
                        <p class="mb-1"> ${productos.currency}: ${productos.cost}</p>
                        </div>
                    </div>
                </div>
            </a>
            `
        }
        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    }
}

  // Botones de orden

function sortProducts(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_PRICE)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_PRICE){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_SOLD){
        result = array.sort(function(a, b) {
            if ( a.soldCount < b.soldCount ){ return -1; }
            if ( a.soldCount > b.soldCount ){ return 1; }
            return 0;
        });
    }

    return result;
}
function sortAndShowProducts(sortCriteria, ProductsArray){
    currentSortCriteria = sortCriteria;

    if(ProductsArray != undefined){
        currentProductsArray = ProductsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    showProductsList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCTS_URL).then(function(resultObj){
      if (resultObj.status === "ok")
      {
        sortAndShowProducts(ORDER_ASC_PRICE, resultObj.data);
      }
      hideSpinner();
    });
    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_PRICE);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_PRICE);
    });

    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_PROD_SOLD);
    });  
    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showProductsList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0){
            minCount = parseInt(minCount);
        }
        else{
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0){
            maxCount = parseInt(maxCount);
        }
        else{
            maxCount = undefined;
        }
        
        showProductsList();
        
    });


});