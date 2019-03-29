import { Component, OnInit } from '@angular/core';
import { MaterialService } from 'src/app/services/material.service';
import { ProfileService } from 'src/app/services/profile.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MainPage } from 'src/app/class/MainPage';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-material',
  templateUrl: './material.page.html',
  styleUrls: ['./material.page.scss'],
})
export class MaterialPage extends MainPage implements OnInit {
  playerData: any;
  resources: [];
  selected = {};
  startList = true;
  endList = false;
  constructor(
    private materialService: MaterialService,
    private profileService: ProfileService,
    translate: TranslateService,
    storage: Storage,
    authService: AuthenticationService) {
    super(translate, authService, storage);
  }
  ngOnInit() {
    super.ngOnInit();
    this.profileService.getLocalPlayerData().then(res => {
      this.playerData = res;
      this.materialService.getMaterial(this.playerData.gameId).then(res => {
        this.resources = res;
        if (res.length > 0) {
          this.selected = res[0]
        }
        console.log(res);
      });
    });

  }
  selectResource(resource) {
    this.selected = resource;

  }
  private getThumb = function (size, url) {
    var results, video;
    if (url === null) {
      return '';
    }
    size = (size === null) ? 'big' : size;
    results = url.match('[\\?&]v=([^&#]*)');
    video = (results === null) ? url : results[1];

    if (size === 'small') {
      return 'http://img.youtube.com/vi/' + video + '/2.jpg';
    }
    return 'http://img.youtube.com/vi/' + video + '/0.jpg';
  };
  scrollUp = function () {
    let gallery = document.getElementById('gallery');
    this.endList = false;
    if (gallery) {
      gallery.scrollTop -= 50;
      if (gallery.scrollTop == 0) {
        this.startList = true;
      }
    }
  }
  scrollDown = function () {
    let gallery = document.getElementById('gallery');
    this.startList = false;
    if (gallery) {
      gallery.scrollTop += 50;
      if (gallery.offsetHeight + gallery.scrollTop >= gallery.scrollHeight) {
        this.endList = true;

      }
    }
  }
  // if (myDiv.offsetHeight + myDiv.scrollTop >= myDiv.scrollHeight) {
  //   scrolledToBottom(e);
  // }

  openResource(resource) {
    window.open(resource.link, '_system', 'location=yes');
  }
  getType(resource) {
    switch (resource.type) {
      case "video":
        {
          return "assets/images/ic_video.png"
        }
        break;
      case "image":
        {
          return "assets/images/ic_link.png"

        }
        break;
      case "link":
        {
          //use default
          return "assets/images/ic_link.png"

        }
        break;

      default:
        break;
    }
  }
  getPreview(size, resource) {
    if (size == "small") {
      switch (resource.type) {
        case "video":
          {
            //if youtube preview otherwise default
            if (resource.previewUri)
              return resource.previewUri;
            if (resource.link)
              return this.getThumb(size, resource.link);
            else return "assets/images/ic_video.png"
          }
          break;
        case "image":
          {
            //use default
            if (resource.previewUri)
              return resource.previewUri;
            if (resource.link)
              return resource.link;
            else return "assets/images/ic_link.png"

          }
          break;
        case "link":
          {
            //use default
            if (resource.previewUri)
              return resource.previewUri;
            return "assets/images/ic_link.png"

          }
          break;

        default:
          break;
      }
    } else {
      switch (resource.type) {
        case "video":
          {
            //if youtube preview otherwise default
            if (resource.previewUri)
              return resource.previewUri;
            if (resource.link)
              return this.getThumb(size, resource.link);
          }
          break;
        case "image":
          {
            //use default
            if (resource.previewUri)
              return resource.previewUri;
            if (resource.link)
              return resource.link;

          }
          break;
        case "link":
          {
            //use default
            if (resource.previewUri)
              return resource.previewUri;

          }
          break;

        default:
          break;
      }
    }
  }
  getFooter() {
    return (this.translate.instant('footer_game_title') + " | " + this.getSchoolName() + " | " + this.getClassName())
  }

  getSchoolName() {
    return this.profileService.getSchoolName();
  }

  getClassName() {
    return this.profileService.getPlayerName();

  }
}
