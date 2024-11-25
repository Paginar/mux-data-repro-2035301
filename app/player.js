import { useRef, useEffect, useState } from "react";
import Video from "react-native-video";
import { StyleSheet, View, Button, Platform, Text } from "react-native";
import { DRMType } from "react-native-video";
import muxReactNativeVideo from "@mux/mux-data-react-native-video";

import * as ScreenOrientation from "expo-screen-orientation";

export default function Player({ navigation }) {
  const [source, setSource] = useState(null);
  const [sourceLoaded, setSourceLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const drmToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzQ3ODU4MDIsImtpZCI6WyIqIl0sImlhdCI6MTczMjE5MzgwMn0.X-4517g_Ekr_odGIPoUroXX1etWanPgy8k8DxFDrsgE";

  function isIOS() {
    return Platform.OS === "ios";
  }

  function isAndroid() {
    return Platform.OS === "android";
  }

  const MuxVideo = muxReactNativeVideo(Video);

  const drmConfiguration = {
    fairplayCertificate:
      "https://lcl.la.drm.cloud/certificate/fairplay?brandGuid=638789c9-5e39-4b6f-a724-2266c2575cba",
    fairplayLicense:
      "https://lcl.la.drm.cloud/acquire-license/fairplay?brandGuid=638789c9-5e39-4b6f-a724-2266c2575cba",
    widevineLicense:
      "https://lcl.la.drm.cloud/acquire-license/widevine?brandGuid=638789c9-5e39-4b6f-a724-2266c2575cba",
  };

  const widevineURL =
    "https://d3man8fx1pdjv8.cloudfront.net/10a5099f-715d-4af3-9cfc-432ce712f4fc/cmaf/SDR/Jackson_Browne_2997fps_DV_HEVC_Rec2020_UHD_Atmos_Stereo.mpd";
  const hlsFairplayURL =
    "https://d3man8fx1pdjv8.cloudfront.net/10a5099f-715d-4af3-9cfc-432ce712f4fc/cmaf/SDR/Jackson_Browne_2997fps_DV_HEVC_Rec2020_UHD_Atmos_Stereo.m3u8";
  function selectDrm({ drmConfiguration, drmToken }) {
    let drmResult;

    if (isAndroid()) {
      // Widevine
      drmResult = {
        type: DRMType.WIDEVINE,
        licenseServer: `${drmConfiguration?.widevineLicense}&userToken=${drmToken}`,
      };
    }
    if (isIOS()) {
      // FairPlay
      drmResult = {
        type: DRMType.FAIRPLAY,
        licenseServer: drmConfiguration?.fairplayLicense,
        certificateUrl: drmConfiguration?.fairplayCertificate,
        getLicense: async (
          spcString,
          contentId,
          licenseUrl,
          loadedLicenseUrl
        ) => {
          const formData = new FormData();
          formData.append("spc", spcString);

          const resultURL = loadedLicenseUrl.replace("skd://", "https://");

          return fetch(`${resultURL}&userToken=${drmToken}`, {
            method: "POST",
            headers: {
              "Content-Type": "multipart/form-data",
              Accept: "application/json",
            },
            body: formData,
          })
            .then((response) => response.json())
            .then((response) => {
              return response.ckc;
            })
            .catch((error) => {
              console.error("Error", error);
            });
        },
      };
    }

    return drmResult;
  }

  const [fullscreen, setFullscreen] = useState(false);

  const videoRef = useRef(null);

  useEffect(() => {
    if (fullscreen) {
      videoRef.current.presentFullscreenPlayer();
    }
  }, [fullscreen]);

  useEffect(() => {
    ScreenOrientation.unlockAsync();
  }, []);

  useEffect(() => {
    if (drmToken !== null && !loading) {
      loadSource();
    }
  }, [loading, drmToken]);

  async function exitVideo(exitFullscreen) {
    if (exitFullscreen) {
      await videoRef.current.dismissFullscreenPlayer();
    }
    setSource(null);

    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );

    setTimeout(() => {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }, 500); // timeout to prevent failed orientation problem
  }

  const loadSource = () => {
    let uri, drm;

    if (isAndroid()) {
      uri = widevineURL;
    } else {
      uri = hlsFairplayURL;
    }
    drm = selectDrm({
      drmConfiguration,
      drmToken,
    });
    setSourceLoaded(true);
    setSource({
      uri,
      drm,
    });
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <>
        {loading || (!source && !hasError) ? (
          <Text>loading...</Text>
        ) : (
          <>
            {!sourceLoaded && !hasError && <Text>loading...</Text>}

            {hasError ? (
              <>
                <View
                  style={[stylesError.container, { paddingHorizontal: 12 }]}
                >
                  <View
                    style={{
                      alignItems: "center",
                      gap: 20,
                      justifyContent: "space-around",
                    }}
                  >
                    <View>
                      <Text
                        type="vodDetailTitle"
                        style={{ textAlign: "center" }}
                      >
                        Warning
                      </Text>
                    </View>

                    <View>
                      <Text
                        type="vodDetailTitle"
                        style={{ textAlign: "center" }}
                      >
                        The application has encountered an unknown error.
                      </Text>
                    </View>

                    <View>
                      <Text type="title2" style={{ textAlign: "center" }}>
                        Please, check your internet connection and try again
                      </Text>
                    </View>
                  </View>
                </View>
                <View>
                  <View>
                    <Button
                      label={"Try again"}
                      onPress={() => {
                        // trigger source loading again
                        navigation.goBack();
                      }}
                    />
                  </View>
                </View>
              </>
            ) : (
              <MuxVideo
                //key={currentVideoTrack}
                ignoreSilentSwitch="ignore"
                ref={videoRef}
                controls={isAndroid()}
                styles={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 2,
                }}
                resizeMode="contain"
                source={{
                  uri: source.uri,
                  drm: source.drm,
                }}
                muxOptions={{
                  application_name: "mux example",
                  data: {
                    env_key: "te712rd1i0s93g9p7mhgobtf8",
                    player_software_version: "6.6.2",
                    player_name: "React Native Player",
                    video_id: "My Video Id",
                    video_title: "My awesome video",
                  },
                }}
                onLoad={(data) => {
                  setSourceLoaded(true);

                  setFullscreen(true);
                }}
                muted={false}
                onError={(e) => {
                  console.log("error", e);
                  setLoading(true);
                  setHasError(true);
                }}
                onFullscreenPlayerDidDismiss={() => {
                  exitVideo(false);
                }}
                onEnd={() => {
                  exitVideo(true);
                }}
              />
            )}
          </>
        )}
      </>
    </View>
  );
}

const styles = StyleSheet.create(live_player_component);

const live_player_component = {
  container: {
    flex: 1,
  },
  playerStatsHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  selectorTracks: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 20,
    justifyContent: "center",
  },
  playerStats: {
    width: "100%",
    zIndex: 7,
    position: "absolute",
    top: 10,
    left: 0,
    flex: 1,
    flexDirection: "colum",
    justifyContent: "flex-start",
    textAlign: "left",
  },
  playerStatsText: {
    width: "100%",
    fontSize: 15,
    textAlign: "left",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 5,
    justifyContent: "center",
    alignItems: "center",
  },

  loader: {
    marginBottom: 0,
  },
  closeIcon: {
    position: "absolute",
    zIndex: 2,
    left: 19.5,
    top: 19.5,
  },
  errorContainer: {
    flex: 2,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 7.8,
  },
  errorDescription: {
    paddingHorizontal: 19.5,
  },
};
