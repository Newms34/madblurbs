Array.prototype.move = function(old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
}
var app = angular.module('ml', []).controller('ml-con', function($scope, $q, $http, $sce) {
    $scope.words = [];
    $scope.currWrdType = null;
    $scope.frags = [];
    $scope.puncs = [];
    $scope.puncTypes = ['.', ',', '!', '?', ';']
    $scope.addPunc = false;
    $scope.currWrdSt = null;
    $scope.uriBase = 'https://en.wiktionary.org/w/api.php?action=query&list=categorymembers&cmlimit=500&cmnamespace=0&format=json&cmtitle=Category:'
    $scope.wrdConst = function(t, st, u) {
        this.type = t;
        this.subtype = st;
        this.uri = u;
        this.val = null;
    }
    $scope.wordTypes = [{
        type: 'Noun',
        subtypes: [{
            type: 'Countable',
            ex: 'Dog',
            actualType: 'English_countable_nouns'
        }, {
            type: 'Uncountable',
            ex: 'Sheep',
            actualType: 'English_uncountable_nouns'
        }, {
            type: 'Plural',
            ex: 'Cats',
            actualType: 'English_noun_plural_forms'
        }, {
            type: 'Proper',
            ex: 'England',
            actualType: 'English_proper_nouns'
        }, {
            type: 'First (given) Name, Male',
            ex: 'John',
            actualType: 'English_male_given_names'
        }, {
            type: 'First (given) Name, Female',
            ex: 'Betty',
            actualType: 'English_female_given_names'
        }, {
            type: 'Surname',
            ex: 'Smith',
            actualType: 'English_surnames'
        }]
    }, {
        type: 'Adjective',
        subtypes: [{
            type: 'Positive (Simple)',
            ex: 'Big',
            actualType: 'English_adjectives'
        }, {
            type: 'Comparative',
            ex: 'Louder',
            actualType: 'English_adjective_comparative_forms'
        }, {
            type: 'Superlative',
            ex: 'Smallest',
            actualType: 'English_adjective_superlative_forms'
        }]
    }, {
        type: 'Verb',
        subtypes: [{
            type: 'Past Participle',
            ex: 'Risen',
            actualType: 'English_past_participles'
        }, {
            type: 'Present Transitive',
            ex: 'Demonstrate',
            actualType: 'English_transitive_verbs'
        }, {
            type: 'Present Intransitive',
            ex: 'Exist',
            actualType: 'English_intransitive_verbs'
        }, {
            type: 'Present Participle',
            ex: 'Eating',
            actualType: 'English_present_participles'
        }, {
            type: '3rd sg. Present',
            ex: 'Thinks',
            actualType: 'English_third-person_singular_forms'
        }, {
            type: 'Simple Past',
            ex: 'Debated',
            actualType: 'English_verb_simple_past_forms'
        }]
    }, {
        type: 'Adverb',
        subtypes: [{
            type: 'Conjunctive',
            ex: 'However',
            actualType: 'English_conjunctive_adverbs'
        }, {
            type: 'Regular',
            ex: 'Quickly',
            actualType: 'English_adverbs'
        }]
    }];
    $scope.getObj = function(a, w) {
        for (var i = 0; i < a.length; i++) {
            if (a[i].type == w) {
                return a[i];
            }
        }
        return false;
    }
    $scope.moveLeft = function(n) {
        console.log(n)
        $('#blurb-order').fadeOut(200, function() {
            if (n && n !== 0) {
                $scope.allBlurbs.move(n, n - 1);
            } else {
                $scope.allBlurbs.move(n, $scope.allBlurbs.length - 1)
            }
            $scope.$digest();
            $('#blurb-order').fadeIn(200)
        });

    };
    $scope.moveRight = function(n) {
        $('#blurb-order').fadeOut(200, function() {
            if (n < $scope.allBlurbs.length - 1) {
                $scope.allBlurbs.move(n, n + 1);
            } else {
                $scope.allBlurbs.move(n, 0)
            }
            $scope.$digest();
            $('#blurb-order').fadeIn(200)
        });
    };
    $scope.allBlurbs = [];
    $scope.doBlurbs = function() {
        $scope.allBlurbs = [];
        $scope.allBlurbs = $scope.allBlurbs.concat($scope.words).concat($scope.frags).concat($scope.puncs);
    }
    $scope.addWrd = function() {
        $scope.words.push(new $scope.wrdConst($scope.currWrdType, $scope.currWrdSt.type, $scope.currWrdSt.actualType));
        $scope.pickinWord = false;
        $scope.doBlurbs();
    };
    $scope.addPunctuation = function() {
        $scope.puncs.push($scope.currPunc);
        $scope.addPunc = false;
        $scope.doBlurbs();
    }
    $scope.addFragment = function() {
        $scope.frags.push($scope.currFrag)
        if (!$scope.currFrag || $scope.currFrag==''){
        	bootbox.alert('You can\'t add a blank fragment!',function(){
        		return true;
        	})
        }else{
        	
        $scope.addFrag = false;
        $scope.doBlurbs();
        }
    };
    $scope.removeWord = function(n) {
        $scope.words.splice(n, 1);
        $scope.doBlurbs();
    };
    $scope.removeFrag = function(n) {
        $scope.frags.splice(n, 1);
        $scope.doBlurbs();
    };
    $scope.alliterate = false;
    $scope.autocap = true;
    $scope.fullStr = 'The quick brown fox jumps over the lazy dog';
    $scope.makeSentence = function() {
        console.log($scope.allBlurbs);
        var wrdProms = [];
        var whichLet = '&cmsort=sortkey&cmstartsortkeyprefix=' + String.fromCharCode(Math.floor(Math.random() * 26) + 65); //in case of alliterating!
        for (var i = 0; i < $scope.allBlurbs.length; i++) {
            if (typeof $scope.allBlurbs[i] != 'string') {
                // $.ajax({method:'GET',url:})
                if (!$scope.alliterate) whichLet = '&cmsort=sortkey&cmstartsortkeyprefix=' + String.fromCharCode(Math.floor(Math.random() * 26) + 65);
                wrdProms.push(
                    $.ajax({
                        method: 'GET',
                        url: $scope.uriBase + $scope.allBlurbs[i].uri + whichLet,
                        dataType: 'jsonp'
                    })
                );
            }
        }
        $q.all(wrdProms).then(function(r) {
            console.log(r);
            $scope.fullStr = '';
            var currRemoteWrd = 0;
            for (i = 0; i < $scope.allBlurbs.length; i++) {
                var newBit;
                if (typeof $scope.allBlurbs[i] == 'string') {
                    newBit = $scope.allBlurbs[i] + ' ';
                } else {
                    var wrd = r[currRemoteWrd].query.categorymembers[Math.floor(Math.random() * r[currRemoteWrd].query.categorymembers.length)].title;
                    newBit = '<a href="https://en.wiktionary.org/wiki/' + wrd + '" target="_blank">' + wrd + '</a> ';
                    currRemoteWrd++;
                }
                if ($scope.autocap) {
                    //auto-capitalization
                    if (i == 0 || ($scope.fullStr[$scope.fullStr.length - 2].match(/\!|.|\,|\?|\;/).length > 1)) {
                        newBit = newBit[0].toUpperCase() + newBit.slice(1);
                    }
                }
                $scope.fullStr += newBit;
            }
            $scope.fullString = $sce.trustAsHtml($scope.fullStr);
        })
    }
    $scope.clearIt = function() {
        bootbox.confirm('Are you sure you wanna clear everything (Words, Fragments, and Punctuation)?', function(r) {
            if (r && r != null) {
                $scope.allBlurbs = [];
                $scope.words = [];
                $scope.frags = [];
                $scope.puncs = [];
                $scope.$digest();
            }
        })
    }
});
