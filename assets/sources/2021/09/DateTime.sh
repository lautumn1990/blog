echo "====================================================="
echo "show linux original format date and time:"
echo DateTime: $(date)
echo "====================================================="
 
echo "show date time like format: YYYY-MM-DD HH:MM:SS"
NOW_DATE_TIME=$(date "+%Y-%m-%d %H:%M:%S")
echo $NOW_DATE_TIME
echo "====================================================="
 
echo "show date time like format: YYYYMMDD-HHMMSS"
NOW_TIME=$(date "+%Y%m%d-%H%M%S")
echo $NOW_TIME
echo "====================================================="
 
echo "show last year:"
LAST_YEAR=$(date "+%Y-%m-%d %H:%M:%S" --date="-1 years")
echo $LAST_YEAR
echo "====================================================="
 
echo "show next year:"
NEXT_YEAR=$(date "+%Y-%m-%d %H:%M:%S" --date="1 years")
echo $NEXT_YEAR
echo "====================================================="
 
echo "show last month:"
LAST_MONTH=$(date "+%Y-%m-%d %H:%M:%S" --date="-1 months")
echo $LAST_MONTH
echo "====================================================="
 
echo "show next month:"
NEXT_MONTH=$(date "+%Y-%m-%d %H:%M:%S" --date="1 months")
echo $NEXT_MONTH
echo "====================================================="
 
echo "show last day:"
LAST_DAY=$(date "+%Y-%m-%d %H:%M:%S" --date="-1 days")
echo $LAST_DAY
echo "====================================================="
 
echo "show next day:"
NEXT_DAY=$(date "+%Y-%m-%d %H:%M:%S" --date="1 days")
echo $NEXT_DAY
echo "====================================================="
 
echo "show last hour:"
LAST_HOUR=$(date "+%Y-%m-%d %H:%M:%S" --date="-1 hours")
echo $LAST_HOUR
echo "====================================================="
 
echo "show next hour:"
NEXT_HOUR=$(date "+%Y-%m-%d %H:%M:%S" --date="1 hours")
echo $NEXT_HOUR
echo "====================================================="
 
echo "show last minute:"
LAST_MINUTE=$(date "+%Y-%m-%d %H:%M:%S" --date="-1 minutes")
echo $LAST_MINUTE
echo "====================================================="
 
echo "show next minute:"
NEXT_MINUTE=$(date "+%Y-%m-%d %H:%M:%S" --date="1 minutes")
echo $NEXT_MINUTE
echo "====================================================="
 
echo "show last second:"
LAST_SECOND=$(date "+%Y-%m-%d %H:%M:%S" --date="-1 seconds")
echo $LAST_SECOND
echo "====================================================="
 
echo "show next second:"
NEXT_SECOND=$(date "+%Y-%m-%d %H:%M:%S" --date="1 seconds")
echo $NEXT_SECOND
echo "====================================================="

echo 按任意键继续
read -n 1
echo 继续运行