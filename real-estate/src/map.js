import React from 'react'
function ReactMap(props) {

const ref = React.useRef();
const [map, setMap] = React.useState();
const [bounds, setBounds] = React.useState([]);
React.useEffect(() => {
    setBounds(React.Children.map(props.children,(obj) => (obj.props.position)))

}, [props.children])

React.useEffect(() => {
        if(bounds.length > 0 && map){
        var b = new window.google.maps.LatLngBounds();
        bounds.map((obj) => {
          b.extend(obj)
        })
        map.fitBounds(b)
        map.setZoom(props.zoom)
      }
        if(ref.current && !map){
        setMap(new window.google.maps.Map(ref.current, {zoom: props.zoom, center: {lat:10,lng:10}}));
        }
      
    }, [ref,map,bounds]);
return (

    <div ref={ref} style={props.style}> 
        {
            React.Children.map(props.children, (child) => {
                if(React.isValidElement(child)){
                    return React.cloneElement(child, {map})
                }

            })
            

        }
    </div>


)

}

export function Marker(options){
    const [marker, setMarker] = React.useState();
    React.useEffect(() => {
        if (!marker) {
          setMarker(new window.google.maps.Marker());
        }
    
        // remove marker from map on unmount
        return () => {
          if (marker) {
            marker.setMap(null);
          }
        };
      }, [marker]);
      React.useEffect(() => {
        if (marker) {
          marker.setOptions(options);
        }
      }, [marker, options]);
      return null;
}

export default ReactMap;
