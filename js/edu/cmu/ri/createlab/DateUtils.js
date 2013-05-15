//======================================================================================================================
// Class providing various static methods for working with dates.
//
// Dependencies: NONE
//
// Author: Chris Bartley (bartley@cmu.edu)
//======================================================================================================================

//======================================================================================================================
// VERIFY NAMESPACE
//======================================================================================================================
// Create the global symbol "edu" if it doesn't exist.  Throw an error if it does exist but is not an object.
var edu;
if (!edu)
   {
   edu = {};
   }
else if (typeof edu != "object")
   {
   var eduExistsMessage = "Error: failed to create edu namespace: edu already exists and is not an object";
   alert(eduExistsMessage);
   throw new Error(eduExistsMessage);
   }

// Repeat the creation and type-checking for the next level
if (!edu.cmu)
   {
   edu.cmu = {};
   }
else if (typeof edu.cmu != "object")
   {
   var eduCmuExistsMessage = "Error: failed to create edu.cmu namespace: edu.cmu already exists and is not an object";
   alert(eduCmuExistsMessage);
   throw new Error(eduCmuExistsMessage);
   }

// Repeat the creation and type-checking for the next level
if (!edu.cmu.ri)
   {
   edu.cmu.ri = {};
   }
else if (typeof edu.cmu.ri != "object")
   {
   var eduCmuRiExistsMessage = "Error: failed to create edu.cmu.ri namespace: edu.cmu.ri already exists and is not an object";
   alert(eduCmuRiExistsMessage);
   throw new Error(eduCmuRiExistsMessage);
   }

// Repeat the creation and type-checking for the next level
if (!edu.cmu.ri.createlab)
   {
   edu.cmu.ri.createlab = {};
   }
else if (typeof edu.cmu.ri.createlab != "object")
   {
   var eduCmuRiCreatelabExistsMessage = "Error: failed to create edu.cmu.ri.createlab namespace: edu.cmu.ri.createlab already exists and is not an object";
   alert(eduCmuRiCreatelabExistsMessage);
   throw new Error(eduCmuRiCreatelabExistsMessage);
   }
//======================================================================================================================

//======================================================================================================================
// CODE
//======================================================================================================================
(function()
   {
   var monthNames =
         [
            {
               "full" : "January",
               "abbrev" : "Jan"
            },
            {
               "full" : "February",
               "abbrev" : "Feb"
            },
            {
               "full" : "March",
               "abbrev" : "Mar"
            },
            {
               "full" : "April",
               "abbrev" : "Apr"
            },
            {
               "full" : "May",
               "abbrev" : "May"
            },
            {
               "full" : "June",
               "abbrev" : "Jun"
            },
            {
               "full" : "July",
               "abbrev" : "Jul"
            },
            {
               "full" : "August",
               "abbrev" : "Aug"
            },
            {
               "full" : "September",
               "abbrev" : "Sep"
            },
            {
               "full" : "October",
               "abbrev" : "Oct"
            },
            {
               "full" : "November",
               "abbrev" : "Nov"
            },
            {
               "full" : "December",
               "abbrev" : "Dec"
            }
         ];

   edu.cmu.ri.createlab.DateUtils = function()
      {
      // no need to do anything here
      };

   /**
    * Converts a String in "yyyy-mm-dd hh:mm:ss" format to a Date.  Returns null if the given string is null or empty.
    */
   edu.cmu.ri.createlab.DateUtils.parseDate = function(dateString)
      {
      if (dateString)
         {
         var datePattern = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
         var matchResult = dateString.match(datePattern);
         if (matchResult)
            {
            var year = matchResult[1];
            var month = matchResult[2];
            var day = matchResult[3];
            var hour = matchResult[4];
            var minute = matchResult[5];
            var second = matchResult[6];
            return new Date(year, month - 1, day, hour, minute, second);
            }
         }
      return null;
      };
   /**
    * Creates a String representation of the given date, including only the month, day, and year.  Returned format is
    * "FULL_MONTH_NAME DATE, YEAR".  Returns an empty String if the given string is null.
    */
   edu.cmu.ri.createlab.DateUtils.createSimpleDateString = function(date)
      {
      return edu.cmu.ri.createlab.DateUtils.createSimpleDateString(date, false);
      };

   /**
    * Creates a String representation of the given date, including only the month, day, and year.  Returned format is
    * either "FULL_MONTH_NAME DATE, YEAR" or "ABBREVIATED_MONTH_NAME DATE, YEAR" depending on the value of the
    * useAbbreviatedMonth argument.  Returns an empty String if the given string is null.
    */
   edu.cmu.ri.createlab.DateUtils.createSimpleDateString = function(date, useAbbreviatedMonth)
      {
      if (date)
         {
         var dateType = (useAbbreviatedMonth) ? 'abbrev' : 'full';
         return monthNames[date.getMonth()][dateType] + " " + date.getDate() + ", " + date.getFullYear();
         }
      return "";
      };

   /**
    * Creates a String representation of the given date, including the month, day, year, and time.  Returned format is
    * "FULL_MONTH_NAME DATE, YEAR at hh:mm:ss AM/PM".  Returns an empty String if the given string is null.
    */
   edu.cmu.ri.createlab.DateUtils.createSimpleDateTimeString = function(date)
      {
      return edu.cmu.ri.createlab.DateUtils.createSimpleDateTimeString(date, false);
      };

   /**
    * Creates a String representation of the given date, including the month, day, year, and time.  Returned format is
    * either "FULL_MONTH_NAME DATE, YEAR at hh:mm:ss AM/PM" or "ABBREVIATED_MONTH_NAME DATE, YEAR at hh:mm:ss AM/PM"
    * depending on the value of the useAbbreviatedMonth argument.  Returns an empty String if the given string is null.
    */
   edu.cmu.ri.createlab.DateUtils.createSimpleDateTimeString = function(date, useAbbreviatedMonth)
      {
      if (date)
         {
         var datePart = edu.cmu.ri.createlab.DateUtils.createSimpleDateString(date, useAbbreviatedMonth);
         var hours = date.getHours();
         var correctedHours = hours;
         var ampm = (hours < 12) ? "AM" : "PM";
         if (hours > 12)
            {
            correctedHours = hours - 12;
            }
         else if (hours == 0)
            {
            correctedHours = 12;
            }
         var minutes = date.getMinutes();
         var paddedMinutes = (minutes < 10) ? "0" + minutes : minutes;
         var seconds = date.getSeconds();
         var paddedSeconds = (seconds < 10) ? "0" + seconds : seconds;
         var timePart = correctedHours + ":" + paddedMinutes + ":" + paddedSeconds + " " + ampm;
         return datePart + " at " + timePart;
         }
      return "";
      };
   })();

