/* eslint 
no-console: 0
*/
import React from 'react';
import { Icon, Button } from 'semantic-ui-react';
// import { navigation } from 'nr1';
import CreateMap from '../map/create';
import DeleteMap from '../map/delete';
import ExportMap from '../map/export';
import Select from 'react-select';
// import UserConfig from '../user-config';
import ManageNodes from '../node/manage';
import ManageLinks from '../link/manage';
import ImportMap from '../map/import';
import RefreshSelector from '../map/refresh';
import ManageIcons from '../icons/manage';
import MapSettings from '../map/settings';
import { DataConsumer } from '../../context/data';

export default class MenuBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedMap: null
    };
  }

  handleMapMenuChange = (
    selectedMap,
    availableMaps,
    updateDataContextState
  ) => {
    if (typeof selectedMap === 'string' || selectedMap instanceof String) {
      const map = availableMaps.filter(map => map.id === selectedMap);
      if (map.length === 1) {
        const selected = { value: map[0].id, label: map[0].id, type: 'user' };
        this.setState({ selectedMap: selected });
        updateDataContextState({ selectedMap: selected }, ['loadMap']);
      }
    } else {
      this.setState(
        { selectedMap },
        () => updateDataContextState({ selectedMap }, ['loadMap']),
        () => console.log(`Map selected:`, this.state.selectedMap)
      );
    }
  };

  render() {
    const { selectedMap } = this.state;

    return (
      <DataConsumer>
        {({
          loading,
          userMaps,
          accountMaps,
          updateDataContextState,
          timelineOpen
        }) => {
          let availableMaps = [];

          if (accountMaps) {
            accountMaps = accountMaps.map(map => ({
              value: map.id,
              label: map.id.replace(/\+/g, ' '),
              type: 'account'
            }));
            availableMaps = [...availableMaps, ...accountMaps];
          }
          if (userMaps) {
            userMaps = userMaps.map(map => ({
              value: map.id,
              label: map.id.replace(/\+/g, ' '),
              type: 'user'
            }));
            availableMaps = [...availableMaps, ...userMaps];
          }

          return (
            <div>
              <div className="utility-bar">
                <div className="react-select-input-group">
                  <label>Select Map</label>
                  <Select
                    options={availableMaps}
                    onChange={map =>
                      this.handleMapMenuChange(
                        map,
                        availableMaps,
                        updateDataContextState
                      )
                    }
                    value={selectedMap}
                    classNamePrefix="react-select"
                  />
                </div>

                {/* <Button onClick={() => openSnackbar('opening snackbar')}>
                  open
                </Button> */}

                {selectedMap ? (
                  <DeleteMap
                    selectedMap={selectedMap}
                    handleMapMenuChange={map =>
                      this.handleMapMenuChange(
                        map,
                        availableMaps,
                        updateDataContextState
                      )
                    }
                  />
                ) : (
                  ''
                )}

                <CreateMap
                  accountMaps={accountMaps}
                  userMaps={userMaps}
                  handleMapMenuChange={map =>
                    this.handleMapMenuChange(
                      map,
                      availableMaps,
                      updateDataContextState
                    )
                  }
                />

                <ImportMap />

                {selectedMap ? <ExportMap selectedMap={selectedMap} /> : ''}

                <div className="flex-push" />

                {selectedMap ? <ManageNodes /> : ''}
                {selectedMap ? <ManageLinks /> : ''}

                {/* <UserConfig /> */}

                <ManageIcons />

                {selectedMap ? <MapSettings /> : ''}

                {selectedMap ? (
                  <Button
                    icon={timelineOpen ? 'clock' : 'clock outline'}
                    content="Timeline"
                    className="filter-button"
                    onClick={() =>
                      updateDataContextState({ timelineOpen: !timelineOpen })
                    }
                  />
                ) : (
                  ''
                )}

                <RefreshSelector />

                <Icon
                  loading={loading}
                  circular
                  name={loading ? 'spinner' : 'circle'}
                  color={loading ? 'black' : 'green'}
                  style={{ backgroundColor: 'white' }}
                />
              </div>
            </div>
          );
        }}
      </DataConsumer>
    );
  }
}
