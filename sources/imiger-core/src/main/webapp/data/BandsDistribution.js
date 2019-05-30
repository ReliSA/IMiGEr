define([ 
    'cz/kajda/timeline/render/BandItemRenderer',
],

function(BandItemRenderer){

    return new Class("BandsDistribution", {
    
        _constructor : function() {},
        bands : [
            {
                id: "person",
                label: "Lidé",
                itemRenderer: new BandItemRenderer("#FFB182"),
                color: "#fafafa"
            },
            {
                id: "item",
                label: "Objekty",
                itemRenderer: new BandItemRenderer("#78B4FF"),
                color: "#fafafa"
            }
        ]

    });

});