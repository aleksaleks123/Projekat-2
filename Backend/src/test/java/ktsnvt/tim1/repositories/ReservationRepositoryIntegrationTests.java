package ktsnvt.tim1.repositories;

import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class ReservationRepositoryIntegrationTests {
    @Autowired
    private ReservationRepository reservationRepository;

    private static DateTimeFormatter dateTimeFormatter;

    @BeforeClass
    public static void setUpSimpleDateFormat() {
        dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    }

    @Test
    public void getAttendanceAndEarningsForPeriod_locationIdAndEventIdAreNull_valuesReturned() {
        LocalDateTime startDate = LocalDateTime.parse("2020-01-01 00:00:00", dateTimeFormatter);
        LocalDateTime endDate = LocalDateTime.parse("2020-01-05 00:00:00", dateTimeFormatter);

        LocalDateTime midDate = LocalDateTime.parse("2020-01-03 00:00:00", dateTimeFormatter);

        int expectedNumberOfDays = 3;
        List<Object[]> expectedResult = new ArrayList<>();
        expectedResult.add(new Object[]{startDate, 1, 31});
        expectedResult.add(new Object[]{midDate, 1, 5});
        expectedResult.add(new Object[]{endDate, 1, 30});

        List<Object[]> returnedResults = reservationRepository.getAttendanceAndEarningsForPeriod(startDate, endDate,
                null, null);

        assertEquals(expectedNumberOfDays, returnedResults.size());

        for (int i = 0; i < expectedNumberOfDays; i++) {
            assertEquals(expectedResult.get(i)[0], returnedResults.get(i)[0]);
            assertEquals(expectedResult.get(i)[1], returnedResults.get(i)[1]);
            assertEquals(expectedResult.get(i)[2], returnedResults.get(i)[2]);
        }
    }

/*    @Test
    public void getAttendanceAndEarningsForPeriod_locationIdIsNotNull_valuesReturned() {
        // TODO
    }

    @Test
    public void getAttendanceAndEarningsForPeriod_bothIdsAreProvided_valuesReturned() {

    }*/
}
