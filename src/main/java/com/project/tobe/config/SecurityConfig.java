package com.project.tobe.config;

import org.springframework.boot.autoconfigure.security.reactive.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity //시큐리티 설정파일을 시큐리티 필터에 등록
public class SecurityConfig {


  @Bean
  public BCryptPasswordEncoder encoder() {
    return new BCryptPasswordEncoder();
  }

//  @Bean
//  public WebSecurityCustomizer webSecurityCustomizer() {
//    return (web) -> web.ignoring()
//        .requestMatchers(PathRequest.toStaticResources().atCommonLocations())
//        .antMatchers("/favicon.ico", "/resources/**", "/error");
//  }

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    //csrf토큰 사용x
    http.csrf().disable();

    // /logout으로 로그아웃을 시도하고 URL주소를 확인하세요
    //모든 요청에 대해 사용자 인증이 필요합니다.
//		http.authorizeRequests( (authorize) -> authorize.anyRequest().authenticated() );

    //user페이지에 대해서만 사용자 인증이 필요합니다.
//		http.authorizeRequests( (authorize) -> authorize.antMatchers("/user/**").authenticated() );

    //user페이지에 대해서 user권한이 필요합니다.
//		http.authorizeRequests( (authorize) -> authorize.antMatchers("/user/**").hasRole("USER")  );

    //user페이지에 대해서 user권한이 필요합니다. admin페이지에 대해서 admin권한이 필요합니다.
//		http.authorizeRequests( (authorize) -> authorize.antMatchers("/user/**").hasRole("USER")
//														.antMatchers("/admin/**").hasRole("ADMIN") );

    //all페지이는 인증만되면 들어갑니다. user페이지에 대해서 user권한이 필요합니다. admin페이지에 대해서 admin권한이 필요합니다.
    //나머지 모든 요청은 요청을 허용합니다.
		http.authorizeRequests( (authorize) -> authorize.antMatchers("/*.do").authenticated()
														.anyRequest().permitAll() );

    //all페지이는 인증만되면 들어갑니다.
    //user페이지에 대해서 user권한 or ADMIN 이필요합니다.
    //admin페이지에 대해서 admin권한이 필요합니다.
    //나머지 모든 요청은 요청을 허용합니다.
//    http.authorizeRequests( (authorize) -> authorize
//        .antMatchers("/all").authenticated()
//        .antMatchers("/user/**").hasAnyRole("USER", "ADMIN")
//        .antMatchers("/admin/**").hasRole("ADMIN")
//        .anyRequest().permitAll() );

    //시큐리티가 제공하는 폼기반 로그인 기능을 사용할 수 있습니다.
    //이후 권한이 없으면 시큐리티는 낚아채서 기본 로그인을 보여줍니다.
    //	http.formLogin( Customizer.withDefaults() );

    //사용자가 제공하는 폼기반 로그인 기능을 사용할 수 있습니다.
    http.formLogin().
        loginPage("/login.user")
        .usernameParameter("employeeId")
        .passwordParameter("employeePw")
        .loginProcessingUrl("/loginForm") //로그인 페이지를 가로채 시큐리티가 제공하는 클래스로 로그인을 연결합니다.
		    .defaultSuccessUrl("/main.do")
        .and()
        .logout()//로그인 성공시 이동될 URL을 적습니다;
        .logoutUrl("/logout")
        .logoutSuccessUrl("/login.user")
        .invalidateHttpSession(true).deleteCookies("JSESSIONID");

    return http.build();
  }

}



  //로그아웃의 처리 - 요청로그아웃주소, 로그아웃 이후에 이동할 경로



//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
//import org.springframework.security.web.SecurityFilterChain;
//
//@Configuration
//@EnableWebSecurity
//public class SecurityConfig extends WebSecurityConfigurerAdapter {
//
//  @Override
//  protected void configure(HttpSecurity http) throws Exception {
//    http.csrf().disable()
//        .authorizeRequests()
//        .antMatchers("/*.do").authenticated()
////        .antMatchers("/security-login/admin/**").hasAuthority(UserRole.ADMIN.name())
//        .anyRequest().permitAll()
//        .and()
//        .formLogin()
//        .usernameParameter("employeeId")
//        .passwordParameter("employeePw")
//        .loginPage("/login.user")
//        .defaultSuccessUrl("/*.do")
//        .failureUrl("/login.user")
//        .and()
//        .logout()
//        .logoutUrl("/login.user")
//        .invalidateHttpSession(true).deleteCookies("JSESSIONID");
//  }
//
////  @Bean
////  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//////    http.csrf(CsrfConfigurer::disable);
////    http.authorizeHttpRequests(authorize ->
////            authorize
//////                .requestMatchers("/user/**").authenticated()
//////                .requestMatchers("/manager/**").hasAnyRole("ADMIN", "MANAGER")
//////                .requestMatchers("/admin/**").hasAnyRole("ADMIN")
////                .anyRequest().permitAll()
////        )
////        .formLogin(
////            formLogin ->
////                formLogin
////                    .loginPage("/login.user")
////                    .loginProcessingUrl("/loginForm") // login 주소가 호출되면 시큐리티가 낚아채서 대신 로그인 진행
////                    .defaultSuccessUrl("/*.do")
////        );
////    return http.build();
////  }
//}