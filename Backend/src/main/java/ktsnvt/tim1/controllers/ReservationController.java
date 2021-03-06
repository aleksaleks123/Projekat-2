package ktsnvt.tim1.controllers;

import com.paypal.base.rest.PayPalRESTException;
import ktsnvt.tim1.DTOs.*;
import ktsnvt.tim1.exceptions.EntityNotFoundException;
import ktsnvt.tim1.exceptions.EntityNotValidException;
import ktsnvt.tim1.exceptions.ImpossibleActionException;
import ktsnvt.tim1.exceptions.PayPalException;
import ktsnvt.tim1.services.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;


@RestController
@RequestMapping("/reservations")
@CrossOrigin
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @GetMapping()
    @Secured("ROLE_USER")
    public ResponseEntity<Object> getReservations(@RequestParam("type") ReservationTypeDTO type, Pageable pageable) {
        if(type==null)
            return new ResponseEntity<>("Type is empty", HttpStatus.BAD_REQUEST);
        return new ResponseEntity<>(reservationService.getReservations(type, pageable), HttpStatus.OK);
    }

    @GetMapping(value = "/{id}")
    @Secured("ROLE_USER")
    public ResponseEntity<Object> getReservation(@PathVariable("id") Long id) {
        try {
            return new ResponseEntity<>(reservationService.getReservation(id), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping()
    @Secured("ROLE_USER")
    public ResponseEntity<Object> createReservation(@Valid @RequestBody NewReservationDTO newReservationDTO) {
        try {
            return new ResponseEntity<>(reservationService.createReservation(newReservationDTO), HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (EntityNotValidException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (ImpossibleActionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @DeleteMapping(value = "/{id}")
    @Secured("ROLE_USER")
    public ResponseEntity<Object> cancelReservation(@PathVariable("id") Long id) {
        try {
            return new ResponseEntity<>(reservationService.cancelReservation(id), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (ImpossibleActionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PostMapping(value = "/{id}")
    @Secured("ROLE_USER")
    public ResponseEntity<Object> payReservationCreatePayment(@PathVariable("id") Long reservationId) {
        try {
            return new ResponseEntity<>(reservationService.payReservationCreatePayment(reservationId), HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (ImpossibleActionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        } catch (PayPalRESTException | PayPalException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_GATEWAY);
        }
    }

    @PostMapping(value = "/{id}/execute-payment")
    @Secured("ROLE_USER")
    public ResponseEntity<Object> payReservationExecutePayment(@Valid @RequestBody PaymentDTO paymentDTO, @PathVariable("id") Long reservationId) {
        try {
            return new ResponseEntity<>(reservationService.payReservationExecutePayment(reservationId, paymentDTO), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (ImpossibleActionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        } catch (PayPalRESTException | PayPalException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_GATEWAY);
        }
    }

    @PostMapping(value = "/create-and-pay")
    @Secured("ROLE_USER")
    public ResponseEntity<Object> createAndPayReservationCreatePayment(@Valid @RequestBody NewReservationDTO newReservationDTO) {
        try {
            return new ResponseEntity<>(reservationService.createAndPayReservationCreatePayment(newReservationDTO), HttpStatus.CREATED);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (EntityNotValidException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (ImpossibleActionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        } catch (PayPalRESTException | PayPalException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_GATEWAY);
        }
    }

    @PostMapping(value = "/create-and-pay/execute")
    @Secured("ROLE_USER")
    public ResponseEntity<Object> createAndPayReservationExecutePayment(@Valid @RequestBody NewReservationAndPaymentDTO newReservationAndPaymentDTO) {
        try {
            return new ResponseEntity<>(reservationService.createAndPayReservationExecutePayment(newReservationAndPaymentDTO.getNewReservationDTO(),
                    newReservationAndPaymentDTO.getPaymentDTO()), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (EntityNotValidException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (ImpossibleActionException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        } catch (PayPalRESTException | PayPalException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_GATEWAY);
        }
    }

}
