/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var React = require('react');
var {Grid, Col, Thumbnail} = require('react-bootstrap');
var HYBRID = require('./images/mapthumbs/HYBRID.jpg');
var ROADMAP = require('./images/mapthumbs/ROADMAP.jpg');
var TERRAIN = require('./images/mapthumbs/TERRAIN.jpg');
var Aerial = require('./images/mapthumbs/Aerial.jpg');
var mapnik = require('./images/mapthumbs/mapnik.jpg');
var mapquestOsm = require('./images/mapthumbs/mapquest-osm.jpg');
var empty = require('./images/mapthumbs/none.jpg');
var unknown = require('./images/mapthumbs/dafault.jpg');
var assign = require('object-assign');
require("./style.css");

let thumbs = {
    google: {
        HYBRID,
        ROADMAP,
        TERRAIN
    },
    bing: {
        Aerial
    },
    osm: {
        mapnik
    },
    mapquest: {
        osm: mapquestOsm
    },
    ol: {
        "undefined": empty
    },
    unknown
};

let BackgroundSwitcher = React.createClass({
    propTypes: {
        id: React.PropTypes.number,
        name: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
        layers: React.PropTypes.array,
        columnProperties: React.PropTypes.object,
        propertiesChangeHandler: React.PropTypes.func
    },
    getDefaultProps() {
        return {
            columnProperties: {
                xs: 6,
                sm: 4,
                md: 2
             }
        };
    },
    renderBackgrounds() {
        if (!this.props.layers) {
            return <div></div>;
        }
        return this.renderLayers( this.props.layers.filter(
            (layer) => {
                if (layer.group === "background") {
                    return layer;
                }
            }));
    },
    renderLayers(layers) {
        let items = [];
        for (let i = 0; i < layers.length; i++) {
            let layer = layers[i];
            let thumb = thumbs[layer.source] && thumbs[layer.source][layer.name] || layer.thumbURL || thumbs.unknown;
            items.push(<Col {...this.props.columnProperties} key={i}>
          <Thumbnail data-position={i} key={"bkg-swicher-item-" + i} bsStyle={layer.visibility ? "primary" : "default"} src={thumb} alt={layer.source + " " + layer.name} onClick={this.changeLayerVisibility}>
                  <div style={{height: '38px', textOverflow: 'ellipsis', overflow: 'hidden'}}><strong>{layer.title}</strong></div>
          </Thumbnail>
      </Col>);
        }
        return items;
    },
    render() {
        return (
           <Grid className="BackgroundSwitcherComponent" header={this.props.name} fluid={false}>{this.renderBackgrounds()}</Grid>
        );
    },
    changeLayerVisibility(eventObj) {
        let position = parseInt(eventObj.currentTarget.dataset.position, 10);
        var layer = this.props.layers[position];
        var newLayer = assign({}, layer, {visibility: true});
        this.props.propertiesChangeHandler(newLayer, position);
    }
});

module.exports = BackgroundSwitcher;