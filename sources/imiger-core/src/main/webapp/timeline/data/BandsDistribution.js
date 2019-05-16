define([ 
    'cz/kajda/timeline/render/BandItemRenderer', 
    'cz/kajda/timeline/render/SplitBandItemRenderer',
    'cz/kajda/timeline/render/DumbbellItemRenderer'
],

function(BandItemRenderer, SplitBandItemRenderer, DumbbellItemRenderer){

    var BandsDistribution = new Class("BandsDistribution", {
    
    _constructor : function() {
    },
    bands : [
          {
               id: "place",
               label: "Místa",
               itemRenderer: new BandItemRenderer("#7DD968"),
               color: "#f5f5f5"
          },
           {
               id: "person",
               label: "Lidé",
               itemRenderer: new BandItemRenderer("#FFB182"),
               color: "#fafafa"
           },
        //    {
        //        id: "event",
        //        label: "Události",
        //        itemRenderer: new BandItemRenderer("#F2BC53"),
        //        color: "#f5f5f5"
        //    },
        //    {
        //        id: "item",
        //        label: "Objekty",
        //        itemRenderer: new BandItemRenderer("#78B4FF"),
        //        color: "#fafafa"
        //    },
           /* FIALA */

           /* Funcki verze */
           // {
           //     id: "split-event",
           //     label: "Rozdeleni",
           //     types: [
           //         {"split-event":"SplitBandItemRenderer"}
           //     ],
           //     itemRenderer: new SplitBandItemRenderer("#03f945"),
           //     color: "#fafafa"
           // },
           // {
           //     id: "dumbbell-entity",
           //     label: "Cinka",
           //     itemRenderer: new DumbbellItemRenderer("#03f945"),
           //     color: "#fafafa"

           // }
           /** Testovaci verze */
        //    {
        //        id: "Rozdeleni",
        //        label: "Rozdeleni",
        //        types: [
        //             {
        //                 id: "split-event", 
        //                 itemRenderer: new SplitBandItemRenderer("#03f945")
        //             },
        //             {
        //                 id: "dumbbell-entity", 
        //                 itemRenderer: new DumbbellItemRenderer("#03f945")
        //             }
        //                ],
        //        // itemRenderer: new SplitBandItemRenderer("#03f945"),
        //        // color: "#fafafa"
        //    },
        /** SJEDNOCENI VSECH */
           {
               id: "Sjednoceny pruh",
               label: "Sjednoceni",
               types: [
                   {
                         id: "event",
                         itemRenderer: new BandItemRenderer("#F2BC53"),
                         color: "#f5f5f5"
                    },
                    {
                         id: "item",
                         itemRenderer: new BandItemRenderer("#78B4FF"),
                         color: "#fafafa"
                    },
                    {
                         id: "split-event", 
                         itemRenderer: new SplitBandItemRenderer("#03f945")
                    },
                    {
                         id: "dumbbell-entity", 
                         itemRenderer: new DumbbellItemRenderer("#03f945")
                    }
               ]
           }

           
       ],    
    });
    return BandsDistribution;
});