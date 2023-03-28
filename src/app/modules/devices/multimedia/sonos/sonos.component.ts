import { Component } from '@angular/core';
import { JeedomCommandResultInterface } from '@models';
import { DeviceMultimediaComponent, MultimediaCommandAction, MultimediaCommandInfo } from '../multimedia.component';

export type SonosCommandInfo = MultimediaCommandInfo & (
  'state'
  | 'shuffle' | 'repeat'
  | 'mute'
  | 'artist' | 'album' | 'title'
  );

export type SonosCommandAction = MultimediaCommandAction & (
  'play' | 'pause' | 'stop' | 'previous' | 'next'
  | 'mute' | 'unmute'
  | 'shuffle' | 'repeat'
  | 'favourite' | 'playlist' | 'radio'
  );

export type SonosCustomValue = 'volumeMax';

@Component({
  selector: 'app-device-sonos',
  templateUrl: 'sonos.component.html',
  styleUrls: [
    '../../base-device.component.scss',
    '../multimedia.component.scss',
    'sonos.component.scss',
  ],
})
export class DeviceSonosComponent
  extends DeviceMultimediaComponent<SonosCommandInfo, SonosCommandAction> {

  protected override _infoCommandValues = {
    state: null,
    volume: null,
    artist: null,
    album: null,
    title: null,
    mute: null, // 0, 1
    shuffle: null, // 0, 1
    repeat: null, // 0, 1
  } as Record<SonosCommandInfo, number | string | null>;

  static override get infoCommandFilters(): Record<SonosCommandInfo, Record<string, string>> {
    return {
      state: { logicalId: 'state' },
      mute: { logicalId: 'mute_state' },
      volume: { logicalId: 'volume' },
      shuffle: { logicalId: 'shuffle_state' },
      repeat: { logicalId: 'repeat_state' },
      artist: { logicalId: 'track_artist' },
      album: { logicalId: 'track_album' },
      title: { logicalId: 'track_title' },
    } as Record<SonosCommandInfo, Record<string, string>>
  }

  static override get actionCommandFilters(): Record<SonosCommandAction, Record<string, string>> {
    return {
      play: { logicalId: 'play' },
      pause: { logicalId: 'pause' },
      stop: { logicalId: 'stop' },
      previous: { logicalId: 'previous' },
      next: { logicalId: 'next' },
      mute: { logicalId: 'mute' },
      unmute: { logicalId: 'unmute' },
      volume: { logicalId: 'setVolume' },
      shuffle: { logicalId: 'shuffle' },
      repeat: { logicalId: 'repeat' },
      favourite: { logicalId: 'play_favourite' },
      playlist: { logicalId: 'play_playlist' },
      radio: { logicalId: 'play_radio' },
    }
  }

  static override get paramValues(): SonosCustomValue[] {
    return [ 'volumeMax' ];
  }

  override updateInfoCommandValues(values: Record<number, JeedomCommandResultInterface>) {
    super.updateInfoCommandValues(values);

    console.log(`-- [${ this.name }] Updated info command values`, this.infoCommandValues);
  }
}
