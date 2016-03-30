var GameLayer = cc.LayerColor.extend({
  var: mainHeroHp = 0,
  var: mainMonsterHp = 0,
  var: stage = 1,
  init: function() {
    this._super( new cc.Color( 127, 127, 127, 255 ) );
    this.setPosition( new cc.Point( 0, 0 ) );
    this.guage = new Guage();
    this.guage.setPosition(new cc.Point(400,150));
    this.addChild(this.guage);
    this.tap = new Tap();
    this.tap.setPosition(new cc.Point(40,150));
    this.addChild(this.tap);
    this.tap.scheduleUpdate();
    this.addKeyboardHandlers();
    this.scheduleUpdate();
    this.hero = new Hero();
    this.monster = new Monster();
    this.addChild(this.hero);
    this.addChild(this.monster);
    mainHeroHp  = this.hero.getHp();
    mainMonsterHp = this.monster.getMHp();

    this.heroLabel = cc.LabelTTF.create( 'HP: '+mainHeroHp, 'Arial', 40 );
    this.heroLabel.setPosition( new cc.Point( 200, 500 ) );
    this.addChild(this.heroLabel);

    this.monsterLabel = cc.LabelTTF.create( 'HP: '+mainMonsterHp, 'Arial', 40 );
    this.monsterLabel.setPosition( new cc.Point( 600, 500 ) );
    this.addChild(this.monsterLabel);

    this.stageLabel = cc.LabelTTF.create( 'Stage: '+stage, 'Arial', 30 );
    this.stageLabel.setPosition( new cc.Point( 400, 550 ) );
    this.addChild(this.stageLabel);

    return true;
  },

  onKeyDown: function( keyCode, event ) {
    if (keyCode == cc.KEY.space){
      if (this.tap.speed == 0){
        this.tap.run();
      }else {
        this.tap.stop();
      }
    }
  },
  onKeyUp: function( keyCode, event ) {

  },
  addKeyboardHandlers: function() {
    var self = this;
    cc.eventManager.addListener({
      event: cc.EventListener.KEYBOARD,
      onKeyPressed : function( keyCode, event ) {
        self.onKeyDown( keyCode, event );
      },
      onKeyReleased: function( keyCode, event ) {
        self.onKeyUp( keyCode, event );
      }
    }, this);
  },
  setMonsterHp: function(newHp) {
    this.monster.setMHp(newHp);
    mainMonsterHp = this.monster.getMHp();
    this.monsterLabel.setString('HP: '+mainMonsterHp);
  },
  setHeroHp: function (newHp) {
    this.hero.setHp(newHp);
    mainHeroHp = this.hero.getHp();
    this.heroLabel.setString('HP: '+mainHeroHp);
  },
    update: function(dt) {

      if(this.monster.mcheck()) {
        this.setMonsterHp(mainMonsterHp -= this.hero.getPower());
        this.tap.setPosition(new cc.Point(40,150));
        this.tap.run();
      }
      if(this.hero.hcheck()) {
        this.setHeroHp(mainHeroHp -= this.monster.getPower());
        this.tap.setPosition(new cc.Point(40,150));
        this.tap.run();
      }

      if (this.tap.speed == 0 && this.tap.closeTo(this.guage)==true) {
        this.monster.mGetAtked();
      }
      else if(this.tap.speed == 0 && this.tap.closeTo(this.guage)==false){
        this.hero.hGetAtked();
      }

      if (this.monster.isDead()&& stage <= 12) {

        this.setMonsterHp(20);
        this.setHeroHp(50);
        var speed = this.tap.getSpeed();
        if (speed < 0) {
          speed *= -1;
        }
          this.tap.setSpeed(speed + 2);
          stage++;
          this.stageLabel.setString('Stage: ' + stage);
        }

      if (this.hero.isDead()) {
        this.setHeroHp(50);
        this.setMonsterHp(20);
        this.tap.setSpeed(defaultSpeed);
        stage = 1;
        this.stageLabel.setString('Stage: '+ stage);
      }

      if (stage == 13 && this.monster.isDead()) {
        this.stageLabel.setString('Game Clear!!');
      }
    },

});

var StartScene = cc.Scene.extend({
  onEnter: function() {
    this._super();
    var layer = new GameLayer();
    layer.init();
    this.addChild( layer );
  }
});
