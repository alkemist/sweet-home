import {Inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {LoggerService} from "./logger.service";
import {UserService} from "./user.service";
import {MessageService} from "primeng/api";
import {DOCUMENT} from "@angular/common";
import {OauthApiService} from "./oauth-api.service";
import {SoapApiService} from "./soap-api.service";
import {MathHelper, XmlHelper} from "@tools";
import {environment} from "../../environments/environment";

@Injectable({
	providedIn: "root"
})
export class SonosService extends OauthApiService {
	protected authorizeUrl: string = `https://api.sonos.com/login/v3/oauth`;
	protected tokenUrl: string = "/sonos-auth";
	protected apiUrl: string = "/sonos-api/";

	protected scope: string = "playback-control-all";

	protected clientId = environment["SONOS_KEY"] as string;
	protected clientSecret = environment["SONOS_SECRET"] as string;

	constructor(
		http: HttpClient,
		loggerService: LoggerService,
		userService: UserService,
		messageService: MessageService,
		protected soapService: SoapApiService,
		@Inject(DOCUMENT) document: Document
	) {
		super("sonos", http, loggerService, userService, messageService, document);
	}

	async test1() {
		const households = await this.buildGetQuery("households");
		console.log("-- [sonos] households", households);
		const householdId = "Sonos_5ngsjv5sG9tMJjlrqqLvdfnpA2.1SuK5if1VAH9eUO4l16S";

		const groups = await this.buildGetQuery(`households/${householdId}/groups`);
		console.log("-- [sonos] groups", groups);
		const groupId = "RINCON_48A6B83EC16601400:3121885620";

		const playlists = await this.buildGetQuery(`households/${householdId}/playlists`);
		console.log("-- [sonos] playlists", playlists);

		/*const session = await this.buildPostQuery(`groups/${ groupId }/playbackSession/joinOrCreate`, {
			appId: "sweet.home",
			appContext: "test",
			customData: "playlistid:12345"
		}) as SonosSessionInterface;
		console.log('-- [sonos] session join or create', session);

		if (session) {
			const loadCloudQueue = await this.buildPostQuery(`playbackSessions/${ session.sessionId }/playbackSession/loadCloudQueue`, {
				queueBaseUrl: "https://spotify-v5.ws.sonos.com/smapi"
			})
			console.log('-- [sonos] load cloud queue', loadCloudQueue);
		}*/

		// new AVTransportService(this.host, this.port, this.uuid);

		// https://github.com/SoCo/SoCo/blob/v0.29.1/soco/plugins/sharelink.py
		// avTransport => AddURIToQueue

		// https://github.com/robbi5/add-to-sonos-queue/blob/master/src/lib/sonos.js#L13
		// /MediaRenderer/AVTransport/Control AddURIToQueue

		// https://github.com/jishi/node-sonos-http-api/blob/master/lib/actions/spotify.js
		// addURIToQueue

		// https://github.com/DjMomo/sonos/blob/master/sonos.class.php
		// AddURIToQueue

		// https://github.com/svrooij/node-sonos-ts/blob/master/src/sonos-device.ts

		// https://github.com/bencevans/node-sonos

		// https://svrooij.io/sonos-api-docs/music-services.html
		// https://svrooij.io/sonos-api-docs/services/av-transport.html#adduritoqueue
		// id:9	Name:Spotify	Auth:AppLink	Url:https://spotify-v5.ws.sonos.com/smapi
		// IP : 192.168.0.61
	}

	async test2() {
		//void this.soapService.action('Stop');
		//void this.soapService.action('GetMediaInfo');

		/*const result = await this.soapService.action('createContainer', {
			containerType: 'playlist',
			title: 'Playlist test'
		});
		console.log(result);*/

		/**
		 * <u:GetMediaInfoResponse xmlns:u="urn:schemas-upnp-org:service:AVTransport:1">
		 *          <NrTracks>125</NrTracks>
		 *          <MediaDuration>NOT_IMPLEMENTED</MediaDuration>
		 *          <CurrentURI>x-rincon-queue:RINCON_48A6B83EC16601400#0</CurrentURI>
		 *          <CurrentURIMetaData />
		 *          <NextURI />
		 *          <NextURIMetaData />
		 *          <PlayMedium>NETWORK</PlayMedium>
		 *          <RecordMedium>NOT_IMPLEMENTED</RecordMedium>
		 *          <WriteStatus>NOT_IMPLEMENTED</WriteStatus>
		 *       </u:GetMediaInfoResponse>
		 */
		/**
		 * <?xml version="1.0"?>
		 * <DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/">
		 * <item id="10030020spotify%3atrack%3a6ouTGbETM7ZdID1eMXZJde" parentID="100a006cstarred" restricted="true">
		 *     <dc:title>Day 'N' Nite - Crookers Remix</dc:title>
		 *     <upnp:class>object.item.audioItem.musicTrack</upnp:class>
		 *     <desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/">SA_RINCON3079_X_#Svc3079-0-Token</desc>
		 * </item>
		 * </DIDL-Lite>
		 */

		//const playlist = 'spotify:playlist:2Ryg9Mq25idinvrNCw4cK0';
		//const guessedMetaData = MetadataHelper.GuessMetaDataAndTrackUri(playlist);
		//console.log('guessedMetaData', guessedMetaData);

		//await this.soapService.action('RemoveAllTracksFromQueue');
		/*await this.soapService.action('AddURIToQueue', {
			EnqueuedURI: 'x-sonos-spotify:spotify%3aplaylist%3a2Ryg9Mq25idinvrNCw4cK0',//guessedMetaData.trackUri,
			EnqueuedURIMetaData: '',// '&lt;DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/"&gt;&lt;item id="10030020spotify%3aplaylist%3a2Ryg9Mq25idinvrNCw4cK0" parentID="100a006cstarred" restricted="true"&gt;&lt;dc:title&gt;Day &amp;apos;N&amp;apos; Nite - Crookers Remix&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.musicTrack&lt;/upnp:class&gt;&lt;desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/"&gt;SA_RINCON3079_X_#Svc3079-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;',//guessedMetaData.metadata,
			DesiredFirstTrackNumberEnqueued: 1,
			EnqueueAsNext: true,
		});*/
		//await this.soapService.action('Play');

		//const playlist = 'spotify:playlist:2Ryg9Mq25idinvrNCw4cK0';

		const rId = MathHelper.round((new Date().getTime()), 0);
		const pId = "2Ryg9Mq25idinvrNCw4cK0";
		const pType = "playlist";
		const pUser = "gamechops";

		const uri = `x-rincon-cpcontainer:${rId}spotify%3auser%3a${pUser}%3aplaylist%3a${pId}`;
		const container = this.soapService.metadata(rId, pType, pId);

		this.soapService.action("AddURIToQueue", {
			EnqueuedURI: uri,
			EnqueuedURIMetaData: XmlHelper.EncodeXml(container),
			DesiredFirstTrackNumberEnqueued: 1,
			EnqueueAsNext: true,
		}).then(() => {

		});

		/*const guessedMetaData = MetadataHelper.GuessMetaDataAndTrackUri(playlist);

		console.log('-- guessedMetaData', guessedMetaData)

		this.soapService.action('AddURIToQueue', {
			EnqueuedURI: guessedMetaData.trackUri,
			EnqueuedURIMetaData: guessedMetaData.metadata,
			DesiredFirstTrackNumberEnqueued: 1,
			EnqueueAsNext: true,
		}).then(() => {

		});

		/*this.soapService.action('AddURIToQueue', {
			EnqueuedURI: 'x-sonos-spotify:spotify%3aplaylist%3a37i9dQZEVXbLoATJ81JYX', //guessedMetaData.trackUri,
			EnqueuedURIMetaData: '' /*{
				Title: 'Spotify playlist',
				CdUdn: 'SA_RINCON2311_X_#Svc2311-0-Token',
				TrackUri: 'x-sonos-spotify:spotify:playlist:37i9dQZEVXbLoATJ81JYX',
				ItemId: '1006206cspotif:playlist:37i9dQZEVXbLoATJ81JYX',
				UpnpClass: 'object.container.playlistContainer',
				ParentId: '10fe2664playlists'
			}*//*,
      DesiredFirstTrackNumberEnqueued: 1,
      EnqueueAsNext: true,
    }).then(() => {

    })

    this.soapService.action('AddURIToQueue', {
      EnqueuedURI: 'x-sonos-spotify:spotify%3aplaylist%3a2Ryg9Mq25idinvrNCw4cK0',//guessedMetaData.trackUri,
      EnqueuedURIMetaData: '', //&lt;DIDL-Lite xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:upnp="urn:schemas-upnp-org:metadata-1-0/upnp/" xmlns:r="urn:schemas-rinconnetworks-com:metadata-1-0/" xmlns="urn:schemas-upnp-org:metadata-1-0/DIDL-Lite/"&gt;&lt;item id="10030020spotify%3aplaylist%3a2Ryg9Mq25idinvrNCw4cK0" parentID="100a006cstarred" restricted="true"&gt;&lt;dc:title&gt;Day &amp;apos;N&amp;apos; Nite - Crookers Remix&lt;/dc:title&gt;&lt;upnp:class&gt;object.item.audioItem.musicTrack&lt;/upnp:class&gt;&lt;desc id="cdudn" nameSpace="urn:schemas-rinconnetworks-com:metadata-1-0/"&gt;SA_RINCON3079_X_#Svc3079-0-Token&lt;/desc&gt;&lt;/item&gt;&lt;/DIDL-Lite&gt;',//guessedMetaData.metadata,
      DesiredFirstTrackNumberEnqueued: 1,
      EnqueueAsNext: true,
    }).then(() => {

    });*/
	}
}
