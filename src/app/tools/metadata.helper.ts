import { SonosTrackInterface } from '@models';
import { XmlHelper } from './xml.helper';

const SpotifyRegion = {
  EU: '2311',
  US: '3079'
}

const DefaultCdudn = 'RINCON_48A6B83EC16601400'; //'RINCON_AssociatedZPUDN';

export abstract class MetadataHelper {
  /**
   * ParseDIDLTrack will parse track metadata for you.
   *
   * @static
   * @param {*} didl Object from XmlParser
   * @param {string} host Sonos host, to make album uri an absolute url
   * @param {number} [port=1400] Sonos port, to make album uri an absolute url
   * @returns {SonosTrackInterface} Parsed track
   * @memberof MetadataHelper
   */
  static ParseDIDLTrack(didl: unknown, host: string, port = 1400): SonosTrackInterface | undefined {
    if (typeof didl === 'undefined') return undefined;

    const parsedItem = didl as { [key: string]: any };
    const didlItem = (parsedItem['DIDL-Lite'] && parsedItem['DIDL-Lite'].item) ? parsedItem['DIDL-Lite'].item : parsedItem;
    const track: SonosTrackInterface = {
      Album: XmlHelper.DecodeHtml(didlItem['upnp:album']),
      Artist: XmlHelper.DecodeHtml(didlItem['dc:creator']),
      AlbumArtUri: undefined,
      Title: XmlHelper.DecodeHtml(didlItem['dc:title']),
      UpnpClass: didlItem['upnp:class'],
      Duration: undefined,
      ItemId: didlItem._id,
      ParentId: didlItem._parentID,
      TrackUri: undefined,
      ProtocolInfo: undefined,
    };
    if (didlItem['r:streamContent'] && typeof didlItem['r:streamContent'] === 'string' && track.Artist === undefined) {
      const streamContent = didlItem['r:streamContent'].split('-');
      if (streamContent.length === 2) {
        track.Artist = XmlHelper.DecodeHtml(streamContent[0].trim());
        track.Title = XmlHelper.DecodeHtml(streamContent[1].trim());
      } else {
        track.Artist = XmlHelper.DecodeHtml(streamContent[0].trim());
        if (didlItem['r:radioShowMd'] && typeof didlItem['r:radioShowMd'] === 'string') {
          const radioShowMd = didlItem['r:radioShowMd'].split(',');
          track.Title = XmlHelper.DecodeHtml(radioShowMd[0].trim());
        }
      }
    }
    if (didlItem['upnp:albumArtURI']) {
      const uri = Array.isArray(didlItem['upnp:albumArtURI']) ? didlItem['upnp:albumArtURI'][0] : didlItem['upnp:albumArtURI'];
      // Github user @hklages discovered that the album uri sometimes doesn't work because of encoding:
      // See https://github.com/svrooij/node-sonos-ts/issues/93 if you found and album art uri that doesn't work.
      const art = (uri as string).replace(/&amp;/gi, '&'); // .replace(/%25/g, '%').replace(/%3a/gi, ':');
      track.AlbumArtUri = art.startsWith('http') ? art : `http://${ host }:${ port }${ art }`;
    }

    if (didlItem.res) {
      track.Duration = didlItem.res._duration;
      track.TrackUri = XmlHelper.DecodeTrackUri(didlItem.res['#text']);
      track.ProtocolInfo = didlItem.res._protocolInfo;
    }

    return track;
  }

  /**
   * Track to MetaData will generate a XML string that can be used as MetaData
   *
   * @static
   * @param {SonosTrackInterface} track The track do describe
   * @param {boolean} includeResource
   * @param {string} cdudn
   * @returns {string} XML string (be sure to encode before using)
   * @memberof MetadataHelper
   */
  static TrackToMetaData(track: SonosTrackInterface | undefined, includeResource = false, cdudn = DefaultCdudn): string {
    if (track === undefined) {
      return '';
    }

    const localCdudn = track.CdUdn ?? cdudn;
    const protocolInfo = track.ProtocolInfo ?? 'http-get:*:audio/mpeg:*';
    const itemId = track.ItemId ?? '-1';

    let metadata = '<DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/">';
    metadata += `<item id="${ itemId }" restricted="true"${ track.ParentId !== undefined ? ` parentID="${ track.ParentId }">` : '>' }`;
    if (includeResource) metadata += `<res protocolInfo="${ protocolInfo }" duration="${ track.Duration }">${ track.TrackUri }</res>`;
    if (track.AlbumArtUri !== undefined) metadata += `<upnp:albumArtURI>${ track.AlbumArtUri }</upnp:albumArtURI>`;
    if (track.Title !== undefined) metadata += `<dc:title>${ track.Title }</dc:title>`;
    if (track.Artist !== undefined) metadata += `<dc:creator>${ track.Artist }</dc:creator>`;
    if (track.Album !== undefined) metadata += `<upnp:album>${ track.Album }</upnp:album>`;
    if (track.UpnpClass !== undefined) metadata += `<upnp:class>${ track.UpnpClass }</upnp:class>`;
    metadata += `<desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">${ localCdudn }</desc>`;
    metadata += '</item></DIDL-Lite>';
    return metadata;
  }

  static GuessMetaDataAndTrackUri(trackUri: string, spotifyRegion = SpotifyRegion.EU): { trackUri: string; metadata: SonosTrackInterface | string } {
    const metadata = MetadataHelper.GuessTrack(trackUri, spotifyRegion);

    return {
      //trackUri: metadata === undefined || metadata.TrackUri === undefined ? trackUri : XmlHelper.DecodeTrackUri(metadata.TrackUri) ?? '',
      trackUri: metadata?.TrackUri ?? trackUri,
      metadata: metadata || '',
    };
  }

  static GuessTrack(trackUri: string, spotifyRegion = SpotifyRegion.EU): SonosTrackInterface | undefined {
    let title = '';
    // Can someone create a test for the next line.
    const match = /.*\/(.*)$/g.exec(trackUri.replace(/\.[a-zA-Z0-9]{3}$/, ''));
    if (match) {
      [ , title ] = match;
    }
    const track: SonosTrackInterface = {};
    if (trackUri.startsWith('x-file-cifs')) {
      track.ItemId = trackUri.replace('x-file-cifs', 'S').replace(/\s/g, '%20');
      track.Title = title.replace('%20', ' ');
      track.ParentId = 'A:TRACKS';
      track.UpnpClass = this.GetUpnpClass(track.ParentId);
      track.TrackUri = trackUri;
      track.CdUdn = DefaultCdudn;
      return track;
    }
    if (trackUri.startsWith('file:///jffs/settings/savedqueues.rsq#') || trackUri.startsWith('sonos:playlist:')) {
      const queueId = trackUri.match(/\d+/g);
      if (queueId?.length === 1) {
        track.TrackUri = `file:///jffs/settings/savedqueues.rsq#${ queueId[0] }`;
        track.UpnpClass = 'object.container.playlistContainer';
        track.ItemId = `SQ:${ queueId[0] }`;
        track.CdUdn = DefaultCdudn;
        return track;
      }
    }
    if (trackUri.startsWith('x-rincon-playlist')) {
      const parentMatch = /.*#(.*)\/.*/g.exec(trackUri);
      if (parentMatch === null) throw new Error('ParentID not found');
      const parentID = parentMatch[1];
      track.ItemId = `${ parentID }/${ title.replace(/\s/g, '%20') }`;
      track.Title = title.replace('%20', ' ');
      track.UpnpClass = this.GetUpnpClass(parentID);
      track.ParentId = parentID;
      track.CdUdn = DefaultCdudn;
      return track;
    }

    if (trackUri.startsWith('x-sonosapi-stream:')) {
      track.UpnpClass = 'object.item.audioItem.audioBroadcast';
      track.Title = 'Some radio station';
      track.ItemId = '10092020_xxx_xxxx'; // Add station ID from url (regex?)
      return track;
    }

    if (trackUri.startsWith('x-rincon-cpcontainer:1006206ccatalog')) { // Amazon prime container
      track.TrackUri = trackUri;
      track.ItemId = trackUri.replace('x-rincon-cpcontainer:', '');
      track.UpnpClass = 'object.container.playlistContainer';
      return track;
    }

    if (trackUri.startsWith('x-rincon-cpcontainer:100d206cuser-fav')) { // Sound Cloud likes
      track.TrackUri = trackUri;
      track.ItemId = trackUri.replace('x-rincon-cpcontainer:', '');
      track.UpnpClass = 'object.container.albumList';
      track.CdUdn = 'SA_RINCON40967_X_#Svc40967-0-Token';
      return track;
    }

    if (trackUri.startsWith('x-rincon-cpcontainer:1006206cplaylist')) { // Sound Cloud playlists
      track.TrackUri = trackUri;
      track.ItemId = trackUri.replace('x-rincon-cpcontainer:', '');
      track.UpnpClass = 'object.container.playlistContainer';
      track.CdUdn = 'SA_RINCON40967_X_#Svc40967-0-Token';
      return track;
    }

    const parts = trackUri.split(':');
    console.log("--- parts ", parts)
    if ((parts.length === 3 || parts.length === 5) && parts[0] === 'spotify') {
      return MetadataHelper.guessSpotifyMetadata(trackUri, parts[1], spotifyRegion);
    }

    if (parts.length === 2 && parts[0] === 'radio' && parts[1].startsWith('s')) {
      const [ , stationId ] = parts;
      track.UpnpClass = 'object.item.audioItem.audioBroadcast';
      track.Title = 'Some radio station';
      track.ItemId = '10092020_xxx_xxxx'; // Add station ID from url (regex?)
      track.TrackUri = `x-sonosapi-stream:${ stationId }?sid=254&flags=8224&sn=0`;
      return track;
    }

    return undefined;
  }

  private static guessSpotifyMetadata(trackUri: string, kind: string, region: string): SonosTrackInterface | undefined {
    const spotifyUri = trackUri.replace(/:/g, '%3a');
    const track: SonosTrackInterface = {
      Title: '',
      //CdUdn: `SA_RINCON${ region }_X_#Svc${ region }-0-Token`,
      CdUdn: `SA_RINCON${ region }_X_#Svc${ region }-23e9faa4-Token`,
    };

    switch (kind) {
      case 'album':
        track.TrackUri = `x-rincon-cpcontainer:1004206c${ spotifyUri }?sid=9&flags=8300&sn=7`;
        track.ItemId = `0004206c${ spotifyUri }`;
        track.UpnpClass = 'object.container.album.musicAlbum';
        break;
      case 'artistRadio':
        track.TrackUri = `x-sonosapi-radio:${ spotifyUri }?sid=9&flags=8300&sn=7`;
        track.ItemId = `100c206c${ spotifyUri }`;
        track.Title = 'Artist radio';
        track.UpnpClass = 'object.item.audioItem.audioBroadcast.#artistRadio';
        track.ParentId = `10052064${ spotifyUri.replace('artistRadio', 'artist') }`;
        break;
      case 'artistTopTracks':
        track.TrackUri = `x-rincon-cpcontainer:100e206c${ spotifyUri }?sid=9&flags=8300&sn=7`;
        track.ItemId = `100e206c${ spotifyUri }`;
        track.ParentId = `10052064${ spotifyUri.replace('artistTopTracks', 'artist') }`;
        track.UpnpClass = 'object.container.playlistContainer';
        break;
      case 'playlist':
        //track.TrackUri = `x-rincon-cpcontainer:1006206c${ spotifyUri }?sid=9&flags=8300&sn=7`;
        track.TrackUri = `x-sonos-spotify:${ spotifyUri }?sid=9&flags=8300&sn=7`;
        //track.ItemId = `1006206c${ spotifyUri }`;
        track.ItemId = `${ spotifyUri }`;
        track.Title = 'Spotify playlist';
        track.UpnpClass = 'object.container.playlistContainer';
        //track.ParentId = '10fe2664playlists';
        track.ParentId = 'playlists';
        break;
      case 'track':
        track.TrackUri = `x-sonos-spotify:${ spotifyUri }?sid=9&amp;flags=8224&amp;sn=7`;
        track.ItemId = `00032020${ spotifyUri }`;
        track.UpnpClass = 'object.item.audioItem.musicTrack';
        break;
      case 'user':
        track.TrackUri = `x-rincon-cpcontainer:10062a6c${ spotifyUri }?sid=9&flags=10860&sn=7`;
        track.ItemId = `10062a6c${ spotifyUri }`;
        track.Title = 'User\'s playlist';
        track.UpnpClass = 'object.container.playlistContainer';
        track.ParentId = '10082664playlists';
        break;
      default:
        return undefined;
    }
    return track;
  }

  private static GetUpnpClass(parentID: string): string {
    switch (parentID) {
      case 'A:ALBUMS':
        return 'object.item.audioItem.musicAlbum';
      case 'A:TRACKS':
        return 'object.item.audioItem.musicTrack';
      case 'A:ALBUMARTIST':
        return 'object.item.audioItem.musicArtist';
      case 'A:GENRE':
        return 'object.container.genre.musicGenre';
      case 'A:COMPOSER':
        return 'object.container.person.composer';
      default:
        return '';
    }
  }
}
